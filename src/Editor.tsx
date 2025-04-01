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
  insertAdditionalTasks 
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
  checkForAsterix 
} from "./extractFunctions";

import { schema } from "./EditorComponents";
import { Block } from "@blocknote/core";

import { useEffect, useState } from "react";

interface EditorProps { 
  file: string, 
  setLoading: (val: boolean) => void, 
  uploadFile: (file: File) => Promise<string> 
}

export const Editor = ({ file, setLoading, uploadFile }: EditorProps) => {
  // console.log(file)
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

    const lines = data.split('\n');
    let inObjectiveSection = false;
    let objectiveWasRead = false;
    let inResourcesSection = false;
    let resourcesWasRead = false;
    let inAdditionalResourcesSection = false;
    let additionalResourcesWasRead = false;
    let inTaskSection = false;
    let taskWasRead = false;
    let inSolutionSection = false;
    let inSolutionWasRead = false;
    let inResultSection = false;
    let inResultWasread = false;
    let inCodeSection = false;
    let inCodeWasRead = false;
    let inTableSection = false;
    let tableWasRead = false;
    let inCommentWasRead = false;
    let inCommentSection = false;
    let inWarningWasRead = false;
    let inWarningSection = false;
    let inLecturerWasRead = false;
    let inLecturerSection = false;
    let inExampleSection = false;
    let inExampleWasRead = false;
    let inWrongExampleSection = false;
    let inWrongExampleWasRead = false;

    const {title, subtitle, week, publicationWeek, validation} = extractMetadata(lines)

    editor.insertBlocks(
      [{ type: "metadata", props: { title, subtitle, week, publicationWeek, validation } }],
      editor.document[editor.document.length - 1].id
    )
    
    let inMetadata = false; // Track if inside metadata

    const taskDescription = [];
    const solutionDescription = [];
    const resultDescription = [];
    const codeBlock = [];
    const commentDescription = [];
    const warningDescription = [];
    const lecturerDescription = [];
    const exampleDescription = [];
    const wrongExampleDescription = [];
    const resourcesBlock = [];

    let solutionShouldBeHidden = false;
    let resultShouldBeHidden = false;

    let exampleTitle = '';
    let wrongExampleTitle = ''

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

      if (/^## Úvod/i.test(line) || /^## Introduction/i.test(line)) {
        editor.insertBlocks([{ type: "introduction" }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }

      if (/^## Záver/i.test(line) || /^## Summary/i.test(line)) {
        editor.insertBlocks([{ type: "summary" }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }
      
      if (/^## Ciele/i.test(line) || /^## Objectives/i.test(line)) {
        inObjectiveSection = true;
        wasInserted = true;
      }

      if (/^> Úloha:/i.test(line) || /^> Task:/i.test(line)) {
        inTaskSection = true;
        wasInserted = true;
      }

      if (/^> Riešenie\*?:/i.test(line) || /^> Solution\*?:/i.test(line)) {
        solutionShouldBeHidden = checkForAsterix(line);
        inSolutionSection = true;
        wasInserted = true;
      }

      if (/^> Výsledok\*?:/i.test(line) || /^> Result\*?:/i.test(line)) {
        resultShouldBeHidden = checkForAsterix(line);
        inResultSection = true;
        wasInserted = true;
      }

      if (/^## Doplňujúce zdroje/i.test(line) || /^## Additional resources/i.test(line)) {
        inAdditionalResourcesSection = true;
        wasInserted = true;
      }

      if (/^## Zdroje/i.test(line) || /^## Resources/i.test(line)) {
        inResourcesSection = true;
        wasInserted = true;
      }

      if (/^## Krok/i.test(line) || /^## Step/i.test(line)) {
        const { valueInsideBraces, textAfterColon } = extractStep(line);
        editor.insertBlocks([{ type: "step", props: { key: valueInsideBraces, name: textAfterColon } }], editor.document[editor.document.length - 1].id);
        wasInserted = true;
      }

      if (/^> Poznámka:/i.test(line) || /^> Comment:/i.test(line)) {
        inCommentSection = true;
        wasInserted = true;
      }

      if (/^> Upozornenie/i.test(line) || /^> Warning:/i.test(line)) {
        inWarningSection = true;
        wasInserted = true;
      }

      if (/^> Vyučujúci/i.test(line) || /^> Lecturer:/i.test(line)) {
        inLecturerSection = true;
        wasInserted = true;
      }

      if (/^> Príklad/i.test(line) || /^> Example:/i.test(line)) {
        inExampleSection = true;
        wasInserted = true;
      }

      if (/^> Zlý Príklad/i.test(line) || /^> Wrong Example:/i.test(line)) {
        inWrongExampleSection = true;
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

      if(inExampleSection && line !== '') {
        const example = extractExample(line)
        if(example?.block) {
          exampleDescription.push(example.block);
        }
        if(example?.title){
          exampleTitle = example.title;
        }
        inExampleWasRead = true;
      }

      if(inWrongExampleSection && line !== '') {
        const wrongExample = extractWrongExample(line)
        if(wrongExample?.block) {
          wrongExampleDescription.push(wrongExample.block);
        }
        if(wrongExample?.title){
          wrongExampleTitle = wrongExample.title;
        }
        inWrongExampleWasRead = true;
      }

      if (inTaskSection) {
        const task = extractTask(line);
        if(task) {
          taskDescription.push(task)
        }
        taskWasRead = true
      }

      if (inSolutionSection) {
        const solution = extractSolution(line);
        if(solution) {
          solutionDescription.push(solution)
        }
        inSolutionWasRead = true
      }

      if (inResultSection) {
        const result = extractResult(line);
        if(result) {
          resultDescription.push(result)
        }
        inResultWasread = true
      }
  
      if (inObjectiveSection && (/^(?:\d+\.\s+|-+\s+)/.test(line.trim()))) {
        const { valueInsideBraces, restOfString } = extractObjective(line);
        editor.insertBlocks([{ type: "objectives", props: { key: valueInsideBraces, name: restOfString } }], editor.document[editor.document.length - 1].id);
        objectiveWasRead = true
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

      if(inCodeSection && line !== '') {
        codeBlock.push(line)
        inCodeWasRead = true 
        wasInserted = true
      }

      if(inCommentSection && line !== ''){
        const comment = extractComment(line);
        if(comment) {
          commentDescription.push(comment)
        }
        inCommentWasRead = true
        wasInserted = true
      }

      if(inWarningSection && line !== ''){
        const warning = extractWarning(line);
        if(warning) {
          warningDescription.push(warning)
        }
        inWarningWasRead = true
        wasInserted = true
      }

      if(inLecturerSection && line !== ''){
        const lecturer = extractLecturer(line);
        if(lecturer) {
          lecturerDescription.push(lecturer)
        }
        inLecturerWasRead = true
        wasInserted = true
      }

      if(objectiveWasRead && line === '') {
        inObjectiveSection = false
      }

      if(taskWasRead && line === '') {
        const taskChildren = await Promise.all(
          taskDescription.map((task) => editor.tryParseMarkdownToBlocks(task))
        )
        editor.insertBlocks([{ type: "task", children: taskChildren.flat() }], editor.document[editor.document.length - 1].id);
        inTaskSection = false
        taskWasRead = false
        wasInserted = true;
        taskDescription.length = 0; // this clears the array
      }

      if(inSolutionWasRead && line === '') {
        const solutionChildren = await Promise.all(
          solutionDescription.map((solution) => editor.tryParseMarkdownToBlocks(solution))
        )

        editor.insertBlocks([{ 
          type: "solution", 
          children: solutionChildren.flat(), 
          props: { defaultHiddenValue: solutionShouldBeHidden }
        }], editor.document[editor.document.length - 1].id);

        inSolutionSection = false
        inSolutionWasRead = false
        wasInserted = true;
        solutionDescription.length = 0; // this clears the array
        solutionShouldBeHidden = false;
      }

      if(inResultWasread && line === '') {
        const resultChildren = await Promise.all(
          resultDescription.map((result) => editor.tryParseMarkdownToBlocks(result))
        )
        editor.insertBlocks([{ 
          type: "result", 
          children: resultChildren.flat(), 
          props: { defaultHiddenValue: resultShouldBeHidden }
        }], editor.document[editor.document.length - 1].id);

        inResultSection = false
        inResultWasread = false
        wasInserted = true;
        resultDescription.length = 0; // this clears the array
        resultShouldBeHidden = false;
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

      if(inCommentWasRead && line === '') {
        const commentChildren = await Promise.all(
          commentDescription.map((comment) => editor.tryParseMarkdownToBlocks(comment))
        )
        editor.insertBlocks([{ 
          type: "comment", 
          children: commentChildren.flat(), 
        }], editor.document[editor.document.length - 1].id);

        inCommentSection = false
        inCommentWasRead = false
        wasInserted = true;
        commentDescription.length = 0; // this clears the array
      }

      if(inWarningWasRead && line === '') {
        const warningChildren = await Promise.all(
          warningDescription.map((warning) => editor.tryParseMarkdownToBlocks(warning))
        )
        editor.insertBlocks([{ 
          type: "warning", 
          children: warningChildren.flat(), 
        }], editor.document[editor.document.length - 1].id);

        inWarningSection = false
        inWarningWasRead = false
        wasInserted = true;
        warningDescription.length = 0; // this clears the array
      }

      if(inLecturerWasRead && line === '') {
        const lecturerChildren = await Promise.all(
          lecturerDescription.map((lecturer) => editor.tryParseMarkdownToBlocks(lecturer))
        )
        editor.insertBlocks([{ 
          type: "lecturer", 
          children: lecturerChildren.flat(), 
        }], editor.document[editor.document.length - 1].id);

        inLecturerSection = false
        inLecturerWasRead = false
        wasInserted = true;
        lecturerDescription.length = 0; // this clears the array
      }

      if(inExampleWasRead && line === '') {
        const exampleChildren = await Promise.all(
          exampleDescription.map((result) => editor.tryParseMarkdownToBlocks(result))
        )
        editor.insertBlocks([{ 
          type: "example", 
          children: exampleChildren.flat(), 
          props: { exampleName: exampleTitle }
        }], editor.document[editor.document.length - 1].id);

        inExampleSection = false
        inExampleWasRead = false
        wasInserted = true;
        exampleDescription.length = 0; // this clears the array
      }

      if(inWrongExampleWasRead && line === '') {
        const wrongExampleChildren = await Promise.all(
          wrongExampleDescription.map((example) => editor.tryParseMarkdownToBlocks(example))
        )
        editor.insertBlocks([{ 
          type: "wrongExample", 
          children: wrongExampleChildren.flat(), 
          props: { exampleName: wrongExampleTitle }
        }], editor.document[editor.document.length - 1].id);

        inWrongExampleSection = false
        inWrongExampleWasRead = false
        wasInserted = true;
        wrongExampleDescription.length = 0; // this clears the array
      }

      if(tableWasRead && line === '') {
        const markdown = await editor.tryParseMarkdownToBlocks(tableBuffer.join("\n"))
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
        inTableSection = false;
        tableWasRead = false;
        wasInserted = true;
        tableBuffer.length = 0;
      }

      if (!wasInserted && !/^>/.test(line) && line !== '') {
        const markdown = await editor.tryParseMarkdownToBlocks(line)
        editor.insertBlocks(markdown, editor.document[editor.document.length - 1].id);
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
              insertAdditionalTasks(editor)
            ],
            query
          )
        }
      />
    </BlockNoteView>
  )
}