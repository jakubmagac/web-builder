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
  insertObjective
} from "./EditorComponents";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
// import { 
//   extractComment, 
//   extractExample, 
//   extractLecturer, 
//   extractMetadata, 
//   extractObjective, 
//   extractResult, 
//   extractSolution, 
//   extractStep, 
//   extractTask, 
//   extractWarning, 
//   extractWrongExample, 
//   isTableSeparator, 
//   checkForAsterix 
// } from "./extractFunctions";

import { PartialBlock } from "@blocknote/core";

import { schema } from "./EditorComponents";
import { Block } from "@blocknote/core";

import { useEffect, useState } from "react";

type Token = { type: string; content?: string, props?: any };

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
    console.log(
      markdownToBlockNote(file)
    )

    editor.insertBlocks(markdownToBlockNote(file), editor.document[editor.document.length - 1].id);

    setLoading(false)
  }, [file])

  function tokenize(text: string): Token[] {
    const tokens: Token[] = [];
    const lines = text.split("\n");
    let currentSection = '';

    for (const line of lines) {
        if (line.startsWith("# ")) {
            tokens.push({ type: "HEADER1", content: line.slice(2) });
        } else if (line.startsWith("## Ciele")) {
            tokens.push({ type: "OBJECTIVES" });
            currentSection = 'objectives'
        } else if (line.startsWith("## Úvod")) {
          tokens.push({ type: "INTRODUCTION" });
        } else if (line.startsWith("## Záver")) {
          tokens.push({ type: "SUMMARY" });
        } else if (line.startsWith("## ")) {
            tokens.push({ type: "HEADER2", content: line.slice(3) });
        } else if (line.startsWith("### ")) {
            tokens.push({ type: "HEADER3", content: line.slice(4) });
        } else if (line.match(/^- /) || line.match(/^\d+\.\s+/)) {
          if (currentSection === 'objectives') {
              const match = line.match(/(?:^\d+\.\s*|-)\s*([^{\n]+)\s*\{([^{}]+)\}/);
              console.log(match)
              // if (match) {
              //     const text = match[1].trim();  // Text pred zátvorkami
              //     const bracketContent = match[2]?.trim();  // Obsah zátvoriek, ak existuje
              //     tokens.push({ type: "OBJECTIVE", props: { key: bracketContent, name: text } });
              // } else {
              //     tokens.push({ type: "OBJECTIVE", props: { name: line } });
              // }
          } else {
              const listItemMatch = line.match(/^\d+\.\s+(.*)/i); 
              if (listItemMatch) {
                  tokens.push({ type: "NUMBER_LIST_ITEM", content: listItemMatch[1] });
              } else {
                  tokens.push({ type: "BULLET_LIST_ITEM", content: line.slice(2) });  // Nečíslovaný zoznam
              }
          }
        } else if (/\*\*(.*?)\*\*/.test(line)) {
            tokens.push({ type: "BOLD", content: line.replace(/\*\*(.*?)\*\*/, '$1') });
        } else if (/\*(.*?)\*/.test(line)) {
            tokens.push({ type: "ITALIC", content: line.replace(/\*(.*?)\*/, '$1') });
        } else {
            tokens.push({ type: "TEXT", content: line });
        }
    }
    return tokens;
  }

  function parseToBlockNote(tokens: Token[]): PartialBlock[] {
    return tokens.map(token => {
        switch (token.type) {
            case "HEADER1":
                return { type: "heading", level: 1, content: token.content };
            case "HEADER2":
                return { type: "heading", level: 2, content: token.content };
            case "HEADER3":
                return { type: "heading", level: 3, content: token.content };
            case "BULLET_LIST_ITEM":
                return { type: "bulletListItem", content: token.content };
            case "NUMBER_LIST_ITEM":
                return { type: "numberListItem", content: token.content };
            case "OBJECTIVES":
                return { type: "objectives" };
            case "OBJECTIVE":
              return { type: "objective", props: {name: token.props.name, key: token.props.key } };
            case "INTRODUCTION":
              return { type: "introduction" };
            case "SUMMARY":
              return { type: "summary" };
            case "BOLD":
                return { type: "text", content: `**${token.content}**` };
            case "ITALIC":
                return { type: "text", content: `*${token.content}*` };
            default:
                return { type: "paragraph", content: token.content };
        }
    });
  }

  function markdownToBlockNote(markdownText: string): PartialBlock[] {
    const tokens = tokenize(markdownText);
    return parseToBlockNote(tokens);
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
              insertAdditionalTasks(editor)
            ],
            query
          )
        }
      />
    </BlockNoteView>
  )
}