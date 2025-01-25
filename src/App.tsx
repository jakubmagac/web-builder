import { BlockNoteView } from "@blocknote/mantine";
import { Block, filterSuggestionItems  } from "@blocknote/core";
import { useState, useEffect } from "react";
import { schema, insertIntroduction, insertObjectives, insertMetadata, insertSummary } from "./EditorComponents";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "./App.css";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import SideBar from './components/SideBar/SideBar'

export default function App() {

  const [blocks, setBlocks] = useState<Block[]>([]);
  const editor = useCreateBlockNote({
    schema: schema,
  });
  const [folderStructure, setFolderStructure] = useState([])

  useEffect(() => {
    getFolderStructure()
  }, [])

  const transformToSchema = (data) => {
    const lines = data.split('\n');
    let inCieleSection = false;

    function extractObjective(input) {
      const regex = /{([^}]+)}\s*(.*)/;
      const match = input.match(regex);
      
      if (match) {
          const valueInsideBraces = match[1];
          const restOfString = match[2];
          return { valueInsideBraces, restOfString };
      } else {
          return { valueInsideBraces: null, restOfString: input };
      }
    }
  

    const blockNoteSchema = lines.forEach(line => {
      if (/^## Úvod/.test(line) || /^## Introduction/.test(line)) {
        editor.insertBlocks([{ type: "introduction" }], blocks[0].id);
      }
      if (/^## Záver/.test(line) || /^## Summary/.test(line)) {
        editor.insertBlocks([{ type: "summary" }], blocks[0].id);
      }
      
      if (/^## Ciele/.test(line)) {
        inCieleSection = true;
      } else if (/^## /.test(line)) {
        inCieleSection = false;
      }

  
      if (inCieleSection && (/^\d+\./.test(line.trim()) || /^-/.test(line.trim()))) {
        const { valueInsideBraces, restOfString } = extractObjective(line);
        console.log(valueInsideBraces)
        console.log(restOfString)
      }
    });
    return blockNoteSchema;
  }

  async function getFolderStructure() {
    try {
      const response = await axios.get('http://localhost:3000/files');
      setFolderStructure(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  
  const openFile = async (path) => {
    console.log(path)
    try {
      const response = await axios.get(`http://localhost:3000/file?folderPath=${path}`);
      console.log(response.data)
      transformToSchema(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  type editor = typeof schema.BlockNoteEditor;
 
  return (
    <div className="editorContainer ">
      <div className="sidebar">
        <SideBar folderStructure={folderStructure} openFile={openFile} />
      </div>
      <div className="editor">
        <BlockNoteView 
          editor={editor} 
          onChange={() => {
            setBlocks(editor.document);
          }} 
          slashMenu={false}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(
                [...getDefaultReactSlashMenuItems(editor), insertIntroduction(editor), insertObjectives(editor), insertMetadata(editor), insertSummary(editor)],
                query
              )
            }
          />
        </BlockNoteView>
        
        <div className={"item bordered"}>
          <pre>
            <code>{JSON.stringify(blocks, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
  
}
 