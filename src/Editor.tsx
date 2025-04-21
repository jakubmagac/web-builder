import { BlockNoteView } from "@blocknote/mantine";
import { filterSuggestionItems  } from "@blocknote/core";
import { 
  insertIntroduction, 
  insertObjectives, 
  insertMetadata, 
  insertSummary, 
  insertStep, 
  insertResource, 
  insertTask, 
  insertSolution, 
  insertResult, 
  insertComment, 
  insertWarning, 
  insertLecturer, 
  insertExample, 
  insertWrongExample, 
  insertAdditionalResource, 
  insertAdditionalTasks, 
  insertObjective,
  insertMath,
  insertYoutube
} from "./EditorComponents";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { 
  extractMetadata, 
  extractObjective, 
  extractStep, 
  isTableSeparator, 
  transformSyntax,
} from "./extractFunctions";

import { schema } from "./EditorComponents";
import { Block } from "@blocknote/core";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";

import { validateOrder } from './validators/validateOrder';
import { validateDuplicates } from './validators/validateDuplicates';
import { validateObjectivePresence } from './validators/validateObjectivePresence';
import { validateResourceChildren } from './validators/validateResourceChildren';
import { validateAdditionalTasksChildren } from "./validators/validateAdditionalTasksChildren";
import { validateObjectivesChildren } from "./validators/validateObjectivesChildren";
import { validateStepPresence } from "./validators/validateStepPresence";
import { validateObjectiveStepKeyUsage } from "./validators/validateObjectiveStepKeyUsage";
import { validateNoSelfNestedBlocks } from "./validators/validateNoSelfNestedBlocks";
import { validateTaskSolutionResultOrder } from "./validators/validateTaskSolutionResultOrder";

interface EditorProps { 
  file: string, 
  openedFilePath: string;
  setLoading: (val: boolean) => void;
  finalMarkdown: string;
  setFinalMarkdown: (val: string) => void;
  setErrors: (val: ErrorObject) => void;
  uploadFile: (file: File) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
}

export type ErrorObject = { [key: string]: string };
export type ValidatorFn = (blocks: Block[]) => ErrorObject;

const kpiMarkBlocks = [
  "task",
  "solution",
  "result",
  "comment",
  "warning",
  "lecturer",
  "example",
  "wrongExample",
];

const keywordMap = {
  "Task": "task",
  "Solution": "solution",
  "Result": "result",
  "Comment": "comment",
  "Warning": "warning",
  "Lecturer": "lecturer",
  "Example": "example",
  "Wrong example": "wrongExample"
};

const supportedMarkdownTypes =  [
  "paragraph",
  "heading",
  "codeBlock",
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
  "table",
  "file",
  "image",
  "video",
  "audio",
  "youtube"
];

export const Editor = ({ 
  file, 
  setLoading, 
  uploadFile, 
  writeFile, 
  openedFilePath, 
  setFinalMarkdown, 
  setErrors, 
  finalMarkdown 
}: EditorProps) => {

  const editor = useCreateBlockNote({ 
    schema,
    uploadFile
  }, [file])

  const [blocks, setBlocks] = useState<Block[]>(editor.document);
  // console.log(blocks)

  const transformBlocksToSyntax = useCallback(async (blocks, indentLevel = 1) => {
    let output = '';
    const indent = '> '.repeat(indentLevel);
  
    for (const block of blocks) {
      switch (block.type) {
        case 'task':
        case 'solution':
        case 'result':
        case 'comment':
        case 'warning':
        case 'lecturer':
        case 'example':
        case 'wrongExample':
          { 
          const keyword = Object.keys(keywordMap).find(key => keywordMap[key] === block.type);
          const title = block.props.exampleName ? ` ${block.props.exampleName}` : '';
          const hiddenStar = block.props.defaultHiddenValue ? '*' : '';

          output += `${indent}${keyword}${hiddenStar}:${title}\n`;
          
          if (block.children && block.children.length > 0) {

            for (const child of block.children) {
              if(supportedMarkdownTypes.includes(child.type)) {
                output += await transformBlocksToSyntax([child], indentLevel) + '\n';
              } else {
                output += await transformBlocksToSyntax([child], indentLevel + 1) + '\n';
              }
            }
          
          }
          break; }
        default:
          const blockToAppend = block;

          if(block.type === 'image') {
            blockToAppend.props.url = 
              block.props.url.substring(block.props.url.indexOf('images/'))
          }

          if(block.type === 'youtube') {
            output += indent 
              + `![${block.props.name}](youtube:${block.props.videoId}${block.props.caption && ` "${block.props.caption}"`})\n\n`;
            break;
          }

          if(block.type === 'video') {
            output += indent 
              + `![${block.props.name}](video:${block.props.url}${block.props.caption && ` "${block.props.caption}"`})\n\n`;
            break;
          }

          if(block.type === 'audio') {
            output += indent 
              + `![${block.props.name}](audio:${block.props.url}${block.props.caption && ` "${block.props.caption}"`})\n\n`;
            break;
          }

          if(block.type === 'file') {
            output += indent 
              + `![${block.props.name}](${block.props.url.match(/images\/.*$/)[0]}${block.props.caption && ` "${block.props.caption}"`})\n\n`;
            break;
          }


          if(block.type === 'math' || block.type === 'codeBlock') {
            if(block.type === 'math') {
              output += indent + "$$" + '\n'
  
              const result = block.children
                .map(child => indent + child.content[0].text)
  
              result.forEach(element => {
                output += element + '\n'
              });
  
              output += indent + "$$" + '\n'
            }
  
            if(block.type === 'codeBlock') {
              const codePart = await editor.blocksToMarkdownLossy([blockToAppend]);
              const result = codePart
                .split('\n')
                .map(line => indent + line)
                .join('\n')
                .replace(/\n$/, '');
              
              output += result
  
            }
          } else {
            output += indent + await editor.blocksToMarkdownLossy([blockToAppend]) + '\n';
            break;
          }
      }
    }
  
    return output.trimEnd();
  }, [editor])

  const handleSave = () => {
    writeFile(openedFilePath, finalMarkdown)
  }


  const transformToSchema = useCallback(async (data: string) => {
    if(!data) return;

    const lines = data.concat('\n').split('\n');
    let inObjectiveSection = false;
    let objectivesWasRead = false;
    let inResourcesSection = false;
    let resourcesWasRead = false;
    let inAdditionalResourcesSection = false;
    let additionalResourcesWasRead = false;
    let inAdditionalTasksSection = false;
    let additionalTasksWasRead = false;
    let inCodeSection = false;
    let inCodeWasRead = false;
    let inTableSection = false;
    let tableWasRead = false;
    let inMath = false;

    let insideBlock = false;

    const {title, subtitle, week, publicationWeek, validation} = extractMetadata(lines)

    editor.insertBlocks(
      [{ type: "metadata", props: { title, subtitle, week, publicationWeek, validation } }],
      editor.document[editor.document.length - 1].id
    )
    
    let inMetadata = false; // Track if inside metadata

    const codeBlock = [];
    const resourcesBlock = [];
    const objectivesBlock = [];
    const additionalTasksBlock = [];
    const mathBlock = [];
    const nestedBlock = [];

    const tableBuffer = [];

    for (const line of lines) {
      let wasInserted = false;

      if (line.trim() === "---") {
        inMetadata = !inMetadata;
        wasInserted = true; 
      }
    
      if (inMetadata) {
        wasInserted = true;
      }

      if (/^## Úvod\b/i.test(line) || /^## Introduction\b/i.test(line)) {
        editor.insertBlocks([{ type: "introduction" }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }

      if (/^## Záver\b/i.test(line) || /^## Summar\by/i.test(line)) {
        editor.insertBlocks([{ type: "summary" }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }
      
      if (/^## Ciele\b/i.test(line) || /^## Objectives\b/i.test(line)) {
        inObjectiveSection = true;
        wasInserted = true;
      }

      if (/^## Doplňujúce zdroje\b/i.test(line) || /^## Additional resources\b/i.test(line)) {
        inAdditionalResourcesSection = true;
        wasInserted = true;
      }

      if (/^## Zdroje\b/i.test(line) || /^## Resources\b/i.test(line)) {
        inResourcesSection = true;
        wasInserted = true;
      }

      if (/^## Krok\b/i.test(line) || /^## Step\b/i.test(line)) {
        const { valueInsideBraces, textAfterColon } = extractStep(line);
        editor.insertBlocks([{ type: "step", props: { key: valueInsideBraces, name: textAfterColon } }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }

      if (/^## Doplňujúce úlohy\b/i.test(line) || /^## Additional tasks\b/i.test(line)) {
        inAdditionalTasksSection = true;
        wasInserted = true;
      }

      if(line.startsWith("```")) {
        inCodeSection = true
      }

      if(tableBuffer.length > 0) {
        if(isTableSeparator(line)) {
          inTableSection = true;
        } else {
          if(!inTableSection) {
            const markdown = await editor.tryParseMarkdownToBlocks(line)
            editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
          }
        }
      } 

      if(inTableSection || /\|/.test(line)) {
        tableBuffer.push(line);
        wasInserted = true;
        tableWasRead = true
      }

      if (inObjectiveSection && (/^(?:\d+\.\s+|-+\s+)/.test(line.trim()))) {
        const { valueInsideBraces, restOfString } = extractObjective(line);
        objectivesBlock.push({ key: valueInsideBraces, name: restOfString });
        objectivesWasRead = true;
        wasInserted = true;
      }

      if (inResourcesSection && (/^(?:\d+\.\s+|[-*+]+\s+)/.test(line.trim())) && line !== '') {
        resourcesBlock.push(line)
        resourcesWasRead = true;
        wasInserted = true;
      }

      if (inAdditionalResourcesSection && (/^(?:\d+\.\s+|[-*+]+\s+)/.test(line.trim())) && line !== '') {
        resourcesBlock.push(line)
        additionalResourcesWasRead = true;
        wasInserted = true;
      }

      if (inAdditionalTasksSection && line !== '') {
        if (!/^## Doplňujúce úlohy/i.test(line) && !/^## Additional tasks/i.test(line)) {
          additionalTasksBlock.push(line)
        }
        additionalTasksWasRead = true;
        wasInserted = true;
      }

      if(inCodeSection && line !== '') {
        codeBlock.push(line)
        inCodeWasRead = true 
        wasInserted = true
      }

      if(objectivesWasRead && line === '') {
        editor.insertBlocks([{ type: "objectives", children: 
          objectivesBlock.map(o => 
            ({ type: "objective", props: { key: o.key, name: o.name } }) 
          )
          }], editor.document[editor.document.length - 1].id);

        inObjectiveSection = false
        objectivesWasRead = false
        wasInserted = true
        objectivesBlock.length = 0 
      }

      if(additionalTasksWasRead && line === '') {

        const blocks = transformSyntax(additionalTasksBlock)
        await traverseElementsAndUpdate(blocks, null, null);

        editor.insertBlocks([{ 
          type: "additionalTasks", 
          children: blocks.flat()
        }], editor.document[editor.document.length - 1].id);


        inAdditionalTasksSection = false
        additionalTasksWasRead = false
        wasInserted = true
        additionalTasksBlock.length = 0 
      }

      if(resourcesWasRead && line === '') {
        inResourcesSection = false;

        const resourceChildren = await Promise.all(
          resourcesBlock.map((resource) => editor.tryParseMarkdownToBlocks(resource))
        )

        editor.insertBlocks([{ 
          type: "resource", 
          children: resourceChildren.flat(), 
        }], editor.document[editor.document.length - 1].id);

        resourcesWasRead = false;
        wasInserted = true;
        resourcesBlock.length = 0;
      }

      if(additionalResourcesWasRead && line === '') {
        inAdditionalResourcesSection = false;

        const resourceChildren = await Promise.all(
          resourcesBlock.map((resource) => editor.tryParseMarkdownToBlocks(resource))
        )

        editor.insertBlocks([{ 
          type: "additionalResources", 
          children: resourceChildren.flat(), 
        }], editor.document[editor.document.length - 1].id);

        additionalResourcesWasRead = false;
        wasInserted = true;
        resourcesBlock.length = 0;
      }

      if(inCodeWasRead && line === '') {
        const markdown = await editor.tryParseMarkdownToBlocks(codeBlock.join("\n"))
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
        inCodeSection = false;
        inCodeWasRead = false;
        wasInserted = true;
        codeBlock.length = 0;
      }
    
      if(tableWasRead && line === '') {
        const markdown = await editor.tryParseMarkdownToBlocks(tableBuffer.join("\n"))
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
        inTableSection = false;
        tableWasRead = false;
        wasInserted = true;
        tableBuffer.length = 0;
      }

      if(!line.startsWith("> ") && !wasInserted){
        insideBlock = false;
        const blocks = transformSyntax(nestedBlock)
        await traverseElementsAndUpdate(blocks, null, null);

        if(!inAdditionalTasksSection) {
          editor.insertBlocks(
            blocks,
            editor.document[editor.document.length - 1].id
          )
          nestedBlock.length = 0
        }        
      }

      if(line.startsWith("> ") && !inAdditionalTasksSection){
        insideBlock = true
      }

      if(insideBlock) {
        nestedBlock.push(line)
      }

      if(line.startsWith("$$")){
        if(inMath) {
          inMath = false
          const mathChildren = mathBlock.map((m) => ({ type: "paragraph", content: m }))
          editor.insertBlocks(
            [{ type: "math", children: mathChildren }],
            editor.document[editor.document.length - 1].id
          )
          wasInserted = true;
        } else {
          wasInserted = true;
          inMath = true
        }
      }

      if(inMath && !line.startsWith("$$")) {
        mathBlock.push(line)
        wasInserted = true;
      }

      if (!wasInserted && !/^>/.test(line) && line !== '') {
        const markdown = await editor.tryParseMarkdownToBlocks(line)


        if(markdown[0].type === 'image') {


          // check if not youtube
          if(markdown[0].props.url.match(/youtube:/g)) {
            const match = line.match(/!\[(.*?)\]\(youtube:(\S+)(?:\s+"(.*?)")?\)/);
            const label = match[1];
            const url = match[2];
            const description = match[3];

            markdown[0].type = 'youtube'
            markdown[0].props.videoId = url
            markdown[0].props.name = label
            markdown[0].props.caption = description || ''

            editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
            continue;
          }

          // or video
          if(markdown[0].props.url.match(/video:/g)) {

            const match = line.match(/!\[(.*?)\]\(video:(\S+)(?:\s+"(.*?)")?\)/);
            const label = match[1];
            const url = match[2];
            const description = match[3] || '';

            markdown[0].type = 'video'
            markdown[0].props.url = url
            markdown[0].props.name = label
            markdown[0].props.caption = description

            editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
            continue;
          }

          // or audio
          if(markdown[0].props.url.match(/audio:/g)) {

            const match = line.match(/!\[(.*?)\]\(audio:(\S+)(?:\s+"(.*?)")?\)/);
            const label = match[1];
            const url = match[2];
            const description = match[3] || '';

            markdown[0].type = 'audio'
            markdown[0].props.url = url
            markdown[0].props.name = label
            markdown[0].props.caption = description

            editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
            continue;
          }

          // or else this
          const imagePath = openedFilePath.substring(0, openedFilePath.lastIndexOf('/'))

          const match = line.match(/!\[(.*?)\]/)

          markdown[0].props.url = markdown[0].props.url.startsWith('http://localhost:3000') 
              ? markdown[0].props.url
              : 'http://localhost:3000' + (
                  markdown[0].props.url.startsWith('/') ? markdown[0].props.url : '/' + imagePath + '/' + markdown[0].props.url
              )
          if(match) {
            markdown[0].props.name = match[1]
          }
        }
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
      }

    }

    async function traverseElementsAndUpdate(elements, parent, indexInParent) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
  
        if (element.type === 'markdown' && element._markdownContent) {
          if (element.isCodeBlock || element.isMath) {
            if(element.isCodeBlock) {
              const markdown = 
                await editor.tryParseMarkdownToBlocks('```\n' + element._markdownContent + '\n```')
              elements[i] = markdown[0];
            }
            if(element.isMath) {
              const children = 
                element._markdownContent
                  .split('\n')
                  .map((e: string) => ({ type: "paragraph", content: e }))

              const markdown = 
                [{ type: "math", children: children }]
              elements[i] = markdown[0];
            }
            
          } else {
            const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(element._markdownContent);

            const blocksToAppend = blocksFromMarkdown;

            for(const block of blocksToAppend) {
              if(block.type === 'image') {

                // check if not youtube
                if(block.props.url.match(/youtube:/g)) {
                  const match = element._markdownContent.match(/!\[(.*?)\]\(youtube:(\S+)(?:\s+"(.*?)")?\)/);
                  const label = match[1];
                  const url = match[2];
                  const description = match[3] || '';

                  block.props.type = 'youtube'
                  block.props.videoId = url
                  block.props.name = label
                  block.props.caption = description
                  continue;
                }

                // or video
                if(block.props.url.match(/video:/g)) {
                  const match = element._markdownContent.match(/!\[(.*?)\]\(video:(\S+)(?:\s+"(.*?)")?\)/);
                  const label = match[1];
                  const url = match[2];
                  const description = match[3] || '';

                  block.props.type = 'video'
                  block.props.url = url
                  block.props.name = label
                  block.props.caption = description
                  continue;
                }

                // or audio
                if(block.props.url.match(/audio:/g)) {
                  const match = element._markdownContent.match(/!\[(.*?)\]\(audio:(\S+)(?:\s+"(.*?)")?\)/);
                  const label = match[1];
                  const url = match[2];
                  const description = match[3] || '';

                  block.props.type = 'audio'
                  block.props.url = url
                  block.props.name = label
                  block.props.caption = description
                  continue;
                }

                block.props.url = 'http://localhost:3000' + (
                  block.props.url.startsWith('/') ? block.props.url : '/' + block.props.url
                )
              }
            }
            
            if (Array.isArray(blocksFromMarkdown) && blocksFromMarkdown.length > 0) {
              elements[i] = { ...blocksFromMarkdown[0], children: element.children };
              if (blocksFromMarkdown.length > 1) {
                elements.splice(i + 1, 0, ...blocksFromMarkdown.slice(1).map(block => ({ ...block, children: [] })));
                i += blocksFromMarkdown.length - 1;
              }
            } else if (blocksFromMarkdown && typeof blocksFromMarkdown === 'object') {
              elements[i] = { ...blocksFromMarkdown, children: element.children };
            }
          }
        }
  
        if (element.children && Array.isArray(element.children)) {
          await traverseElementsAndUpdate(element.children, elements, i);
        }
      }
    }
  }, [editor])

  const transformToKPIMark = useCallback(async (data: Block[]) => {
    if(!data) return

    let markdown = ''

    for (const element of data) {
      if(element.type === 'metadata') {
        markdown += '---\n'

        if(element.props.title) {
          markdown += 'Title: ' + element.props.title + '\n'
        }

        if(element.props.subtitle) {
          markdown += 'Subtitle: ' + element.props.subtitle + '\n'
        }

        if(element.props.publicationWeek) {
          markdown += 'Publication-week: ' + element.props.publicationWeek + '\n'
        }

        if(element.props.week) {
          markdown += 'Week: ' + element.props.week + '\n'
        }

        markdown += 'Validation: ' + (element.props.validation ? 'strict' : 'None') + '\n'
        markdown += '---\n\n'
      }

      if(element.type === 'introduction') {
        markdown += '\n## Introduction \n'
      }

      if(element.type === 'summary') {
        markdown += '\n## Summary \n'
      }

      if(element.type === 'objectives') {
        markdown += '## Objectives\n\n'
        element.children.forEach((e, id) => {
          markdown += 
            e.props.key 
              ? (id + 1) + '.' + '{' + e.props.key + '} ' + e.props.name + '\n'
              : (id + 1) + '.' + e.props.name + '\n'
        })
      }

      if(element.type === 'step') {
        markdown += '\n## Step' + (
          element.props.name 
            ? ': ' + element.props.name + ' {' + element.props.key + '}'
            : ' {' + element.props.key + '}'
          ) + '\n'
      }

      if(element.type === 'resource') {
        markdown += '\n## Resources\n'
        const markdownFromBlocks = await editor.blocksToMarkdownLossy(element.children);
        markdown += markdownFromBlocks + '\n'
      }

      if(element.type === 'additionalResources') {
        markdown += '\n## Additional resources\n'
        const markdownFromBlocks = await editor.blocksToMarkdownLossy(element.children);
        markdown += markdownFromBlocks + '\n';
      }

      if(element.type === 'additionalTasks') {
        markdown += '\n## Additional tasks\n'
        const markdownFromBlocks = await transformBlocksToSyntax(element.children);
        markdown += markdownFromBlocks + '\n';
      }

      if(element.type === 'math') {
          markdown += "$$" + '\n'

          const result = element.children
            .map(child => child.content[0].text)

          result.forEach(element => {
            markdown += element + '\n'
          });

          markdown += "$$" + '\n'
      }

      if(kpiMarkBlocks.includes(element.type)) {
        const markdownFromBlocks = await transformBlocksToSyntax([element]);
        markdown += markdownFromBlocks + '\n';
      }

      if(supportedMarkdownTypes.includes(element.type)) {
        const blockToAppend = element;

        if(element.type === 'file') {
          blockToAppend.props.url = 
            element.props.url.substring(element.props.url.indexOf('images/'))
        }

        if(element.type === 'image') {
          blockToAppend.props.url = 
            element.props.url.substring(element.props.url.indexOf('images/'))
        }

        if(element.type === 'youtube') {
          markdown += `![${blockToAppend.props.name}](youtube:${blockToAppend.props.videoId} "${blockToAppend.props.caption}")\n\n`;
          continue;
        }

        if(element.type === 'video') {
          markdown += `![${blockToAppend.props.name}](video:${blockToAppend.props.url}${blockToAppend.props.caption && ' "' + blockToAppend.props.caption + '"'})\n\n`;
          continue;
        }

        if(element.type === 'audio') {
          markdown += `![${blockToAppend.props.name}](audio:${blockToAppend.props.url}${blockToAppend.props.caption && ' "' + blockToAppend.props.caption + '"'})\n\n`;
          continue;
        }

        const markdownFromBlocks = await editor.blocksToMarkdownLossy([blockToAppend]);
        markdown += markdownFromBlocks + '\n'
      }

    }

    return markdown;
  }, [editor, transformBlocksToSyntax])

  useEffect(() => {
    setLoading(true)
    transformToSchema(file);
    setLoading(false)
  }, [file, setLoading, transformToSchema])

  useEffect(() => {
    const getMarkdown = async () => {
      const markdown = await transformToKPIMark(blocks) || ''
      setFinalMarkdown(markdown)
    };

    const validators: ValidatorFn[] = [
      validateOrder,
      validateDuplicates,
      validateObjectivePresence,
      validateResourceChildren,
      validateAdditionalTasksChildren,
      validateObjectivesChildren,
      validateStepPresence,
      validateObjectiveStepKeyUsage,
      validateNoSelfNestedBlocks,
      validateTaskSolutionResultOrder
    ];

    const runValidators = (blocks: Block[], setErrors: (e: ErrorObject) => void) => {
      const allErrors: ErrorObject = {};

      validators.forEach(validator => {
        const result = validator(blocks);
        Object.assign(allErrors, result);
      });

      setErrors(allErrors);
    }
  
    getMarkdown();
    runValidators(blocks, setErrors)
  }, [blocks, setErrors, transformToKPIMark, setFinalMarkdown]);
  
  if(!file) {
    return <>Not selected file</>
  }

  type editor = typeof schema.BlockNoteEditor;

  return (
    <div>
      <BlockNoteView
        editor={editor} 
        onChange={() => {
          setBlocks(editor.document);
        }} 
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query: string) =>
            filterSuggestionItems(
              [
                ...getDefaultReactSlashMenuItems(editor), 
                insertIntroduction(editor), 
                insertObjectives(editor), 
                insertObjective(editor),
                insertMetadata(editor), 
                insertSummary(editor), 
                insertStep(editor), 
                insertResource(editor),
                insertTask(editor),
                insertSolution(editor),
                insertResult(editor),
                insertComment(editor),
                insertWarning(editor),
                insertLecturer(editor),
                insertExample(editor),
                insertWrongExample(editor),
                insertAdditionalResource(editor),
                insertAdditionalTasks(editor),
                insertMath(editor),
                insertYoutube(editor)
              ],
              query
            )
          }
        />
      </BlockNoteView>
      <div className="ml-13">
        <Button variant="outlined" onClick={handleSave}>Submit</Button>
      </div>
    </div>
  )
}