import { useState, useEffect } from "react";

import "./App.css";
import { Editor } from "./Editor";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import SideBar from './components/SideBar/SideBar'
import RemoveModal from "./components/RemoveModal/RemoveModal";

export default function App() {
  const [folderStructure, setFolderStructure] = useState([])
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [fileToRemove, setFileToRemove] = useState('')
  const [openedFile, setOpenedFile] = useState('');

  useEffect(() => {
    getFolderStructure()
  }, [])

  async function getFolderStructure() {
    try {
      const response = await axios.get('http://localhost:3000/files');
      setFolderStructure(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  
  const openFile = async (path: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/file?folderPath=${path}`)
      setFile(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const removeFile = async (path: string) => {
    setShowRemoveModal(true);
    setFileToRemove(path)
  }

  const renameFile = async (path: string, fileName: string) => {
    try {
      const response = await axios.put(`http://localhost:3000/file?filePath=${path}&fileName=${fileName}`)

      if(response.status === 200) {
        getFolderStructure()
      }
    } catch (error) {
      console.error(error);
    }
  }

  const createFile = async (path: string) => {
    try {
      const response = await axios.post(`http://localhost:3000/file?filePath=${path}`)

      if(response.status === 200) {
        getFolderStructure()
        openFile(path)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemove = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/file?filePath=${fileToRemove}`);
      setShowRemoveModal(false)
      getFolderStructure();
      setFile('');
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = () => {
    setFileToRemove('')
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
          createFile={createFile} 
          removeFile={removeFile} 
          openFile={openFile} 
          openedFile={openedFile}
          setOpenedFile={setOpenedFile}
          renameFile={renameFile}
        />
      </div>
      <div className="editor relative">
        {
          loading ? 'loading' : (
            <Editor 
              file={file}
              setLoading={setLoading}
              uploadFile={uploadFile}
            />
          )
        }
        {
          showRemoveModal && (
            <RemoveModal handleRemove={handleRemove} closeModal={closeModal}  />
          )
        }
      </div>
    </div>
  )
  
}
 