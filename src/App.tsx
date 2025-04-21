import { useState, useEffect } from "react";

import "./App.css";
import { Editor, ErrorObject } from "./Editor";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import SideBar from './components/SideBar/SideBar'
import RemoveModal from "./components/RemoveModal/RemoveModal";
import ConfigPage from './components/ConfigPage/ConfigPage'

export default function App() {
  const [folderStructure, setFolderStructure] = useState([])
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [fileToRemove, setFileToRemove] = useState('')
  const [folderToRemove, setFolderToRemove] = useState('')
  const [openedFile, setOpenedFile] = useState('');
  const [isConfig, setIsConfig] = useState(false);
  const [error, setError] = useState('');
  const [finalMarkdown, setFinalMarkdown] = useState('');
  const [fileSaved, setFileSaved] = useState(false);
  const [errors, setErrors] = useState<ErrorObject>({})
  const [usedFilesFromDocuments, setUsedFilesFromDocuments] = useState<string[]>([]);

  useEffect(() => {
    getFolderStructure()
  }, [])
  
  async function getFolderStructure() {
    setError('')
    try {
      const response = await axios.get('http://localhost:3000/files');
      setFolderStructure(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  
  const openFile = async (path: string, root = false) => {
    setIsConfig(false);
    setFile('')
    setFileSaved(false)
    setUsedFilesFromDocuments([])

    try {
      const response = await axios.get(`http://localhost:3000/file?filePath=${path}&root=${root}`)
      setFile(response.data)
      setOpenedFile(root ? ('course/content/' + path) : path)
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(`http://localhost:3000/resources?filePath=${path}&root=${root}`)
      setUsedFilesFromDocuments(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const removeFile = async (path: string) => {
    setShowRemoveModal(true);
    setFileToRemove(path)
  }

  const removeFolder = async (path: string) => {
    setShowRemoveModal(true);
    setFolderToRemove(path)
  }

  const renameFile = async (path: string, fileName: string) => {
    setFileSaved(false)
    try {
      const response = await axios.put(`http://localhost:3000/file?filePath=${path}&fileName=${fileName}`)

      if(response.status === 200) {
        getFolderStructure()
      }
    } catch (error) {
      console.error(error);
    }
  }

  const renameFolder = async (path: string, fileName: string) => {
    setFileSaved(false)

    try {
      const response = await axios.put(`http://localhost:3000/folder?folderPath=${path}&name=${fileName}`)

      if(response.status === 200) {
        getFolderStructure()
      }
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  const createFile = async (path: string, options: { root?: boolean } = { root: false }) => {
    setError('')
    setFileSaved(false)

    try {
      const response = await axios.post(`http://localhost:3000/file?filePath=${path}&root=${options.root}`)

      if(response.status === 200) {
        getFolderStructure()
        openFile(path, options.root)
      }
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  const writeFile = async (path: string, content: string) => {
    setFileSaved(false)
    setError('')
    try {
      const response = await axios.post(`http://localhost:3000/file?filePath=${path}`,{
        content
      } )

      if(response.status === 200) {
        setFileSaved(true)
      }
    } catch (error) {
      setError(error.response.data.error)
    }

    const matches = [...content.matchAll(/!\[.*?\]\(images\/(.*?)\)/g)];
    const filenames = matches.map(match => match[1]);

    try {
      const response = await axios.delete(`http://localhost:3000/resources?filePath=${path}`,{
        data: { allowedFiles: [...new Set([...usedFilesFromDocuments, ...filenames])] }
      })

      if(response.status === 200) {
        setFileSaved(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createFolder = async (name: string) => {
    setFileSaved(false)

    try {
      const response = await axios.post(`http://localhost:3000/folder?name=${name}`)

      if(response.status === 200) {
        getFolderStructure()
      }
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  const handleRemoveFile = async () => {
    setFileSaved(false)

    try {
      await axios.delete(`http://localhost:3000/file?filePath=${fileToRemove}`);
      setShowRemoveModal(false)
      getFolderStructure();
      setFile('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemoveFolder = async () => {
    setFileSaved(false)

    try {
      await axios.delete(`http://localhost:3000/folder?name=${folderToRemove}`);
      setShowRemoveModal(false)
      getFolderStructure();
      setFile('');
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setFileToRemove('')
    setFolderToRemove('')
    setShowRemoveModal(false)
  }

  async function uploadFile(file: File) {
    const regex = /^course\/content\/([^\/]+)(\/.*\.md)$/;
    const match = openedFile.match(regex);
    const body = new FormData();

    body.append("image", file);

    const ret = await axios.post(`http://localhost:3000/upload${match ? `?path=${match[1]}` : ''}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return ret.data.imageUrl
  }

  return (
    <div className="editorContainer">
      <div className="sidebar">
        <SideBar 
          folderStructure={folderStructure} 
          setIsConfig={setIsConfig}
          isConfigPage={isConfig}
          createFile={createFile} 
          removeFile={removeFile} 
          removeFolder={removeFolder}
          openFile={openFile} 
          openedFile={openedFile}
          setOpenedFile={setOpenedFile}
          renameFile={renameFile}
          renameFolder={renameFolder}
          createFolder={createFolder}
        />
        <div className="text-red-600 text-center">
          {error}
        </div>
      </div>
      <div className="editor relative">
        {
          loading ? 'loading' : (
            !isConfig ? (
              <Editor 
                file={file}
                setLoading={setLoading}
                uploadFile={uploadFile}
                writeFile={writeFile}
                openedFilePath={openedFile}
                setFinalMarkdown={setFinalMarkdown}
                finalMarkdown={finalMarkdown}
                setErrors={setErrors}
              />
            ) 
            : <ConfigPage />
          )
        }
        {
          showRemoveModal && (
            <RemoveModal 
              type={fileToRemove ? 'file' : 'folder'}
              handleRemoveFile={handleRemoveFile} 
              handleRemoveFolder={handleRemoveFolder} 
              closeModal={closeModal}  
            />
          )
        }
      </div>
      {
        !isConfig && file && (
          <div className="debugger overflow-auto w-[30%]">
            <p className="">Errors:</p>
            {errors?.noObjectiveError && <div className="text-red-400 mb-2">{errors.noObjectiveError}</div>}
            {errors?.order && <div className="text-red-400 mb-2">{errors.order}</div>}
            {errors?.duplicates && <div className="text-red-400 mb-2">{errors.duplicates}</div>}
            {errors?.resourceChildren && <div className="text-red-400 mb-2">{errors.resourceChildren}</div>}
            {errors?.additionalTasksChildren && <div className="text-red-400 mb-2">{errors.additionalTasksChildren}</div>}
            {errors?.objectivesChildren && <div className="text-red-400 mb-2">{errors.objectivesChildren}</div>}
            {errors?.noStepError && <div className="text-red-400 mb-2">{errors.noStepError}</div>}
            {errors?.objectiveStepKeys && <div className="text-red-400 mb-2">{errors.objectiveStepKeys}</div>}
            {errors?.noSelfNesting && <div className="text-red-400 mb-2">{errors.noSelfNesting}</div>}
            {errors?.taskSolutionResultOrder && <div className="text-red-400 mb-2">{errors.taskSolutionResultOrder}</div>}
            {
              fileSaved && (
                <div className="text-green-700 font-bold">File Saved</div>
              )
            }
          </div>
        )
      }
    </div>
  )
  
}
 