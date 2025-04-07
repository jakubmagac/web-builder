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
  insertMath
} from "./EditorComponents";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { 
  extractComment, 
  extractExample, 
  extractLecturer, 
  extractMetadata, 
  extractObjective, 
  extractResult, 
  extractSolution, 
  extractStep, 
  extractTask, 
  extractWarning, 
  extractWrongExample, 
  isTableSeparator, 
  checkForAsterix,
  parseBlocks,
  transformSyntax,
  traverseElements
} from "./extractFunctions";

import { schema } from "./EditorComponents";
import { Block } from "@blocknote/core";

import { useEffect, useState } from "react";

// type Token = { type: string; content?: string, props?: any };

interface EditorProps { 
  file: string, 
  setLoading: (val: boolean) => void, 
  uploadFile: (file: File) => Promise<string> 
}

export const Editor = ({ file, setLoading, uploadFile }: EditorProps) => {
  const editor = useCreateBlockNote({ 
    schema,
    uploadFile
  }, [file])

  const [blocks, setBlocks] = useState<Block[]>(editor.document);
  
  useEffect(() => {
    setLoading(true)
    transformToSchema(file);
    setLoading(false)
  }, [file])

  const transformToSchema = async (data: string) => {
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

      if (inResourcesSection && (/^(?:\d+\.\s+|-+\s+)/.test(line.trim())) && line !== '') {
        resourcesBlock.push(line)
        resourcesWasRead = true;
        wasInserted = true;
      }

      if (inAdditionalResourcesSection && (/^(?:\d+\.\s+|-+\s+)/.test(line.trim())) && line !== '') {
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
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
      }

    }

    async function traverseElementsAndUpdate(elements, parent, indexInParent) {
      if (Array.isArray(elements)) {
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
                  await editor.tryParseMarkdownToBlocks(element._markdownContent)

                const markdown = 
                  [{ type: "math", children: children }]
                elements[i] = markdown[0];
              }
              
            } else {
              // Bežné markdown bloky spracujeme ako predtým
              const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(element._markdownContent);
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
      } else if (elements && typeof elements === 'object') { // ak je to samostatny objekt
        if (elements.type === 'markdown' && elements._markdownContent && parent && typeof indexInParent === 'number') {

          if (elements.isCodeBlock || elements.isMath) {
            if(elements.isCodeBlock) {
              const markdown =
                await editor.tryParseMarkdownToBlocks('```\n' + elements._markdownContent + '\n```');
              if (Array.isArray(markdown) && markdown.length > 0) {
                parent[indexInParent] = markdown[0];
              }
            }
            if(elements.isMath) {
              const children = 
                await editor.tryParseMarkdownToBlocks(elements._markdownContent)

              if (Array.isArray(children) && children.length > 0) {
                parent[indexInParent] = children[0];
              }
            }
          }
          
          else {
            const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(elements._markdownContent);
            if (Array.isArray(blocksFromMarkdown) && blocksFromMarkdown.length > 0) {
              parent[indexInParent] = { ...blocksFromMarkdown[0], children: elements.children };
            } else if (blocksFromMarkdown && typeof blocksFromMarkdown === 'object') {
              parent[indexInParent] = { ...blocksFromMarkdown, children: elements.children };
            }
          }
        }
        if (elements.children && Array.isArray(elements.children)) {
          await traverseElementsAndUpdate(elements.children, elements, null);
        }
      }
    }
  }

  
  if(!file) {
    return <>Not selected file</>
  }

  type editor = typeof schema.BlockNoteEditor;

  return (
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
              insertMath(editor)
            ],
            query
          )
        }
      />
    </BlockNoteView>
  )
}