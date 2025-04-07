import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder,faTrashCan, faPlusSquare, faCheckSquare, faRectangleXmark, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { Settings } from './Settings';

interface FolderStructureType {
  content: ContentType[]
}

interface ContentType {
  children: ContentType[];
  name: string;
  path: string;
  type: "folder" | "file";
}

interface SideBarProps {
  folderStructure: FolderStructureType;
  openedFile: string;
  isConfigPage: boolean;
  setIsConfig: (value: boolean) => void;
  createFile: (path: string) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  setOpenedFile: (fileName: string) => void;
  removeFile: (path: string) => Promise<void>;
  renameFile: (path: string, fileName: string) => Promise<void>;
}

interface SideBarButtonProps {
  createFile: (path: string) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  removeFile: (path: string) => Promise<void>;
  renameFile: (path: string, fileName: string) => Promise<void>;
  openedFile: string;
  setOpenedFile: (fileName: string) => void;
  item: ContentType;
}

interface NewFileProps {
  createFile: (fileName: string) => void;
  cancelCreating: () => void;
  item: ContentType;
}

const getIntend = (path: string) => {
  let count = 0;
  for (const char of path) {
    if (char === '/') count++;
  }
  return count - 1;
}

const NewFile = ({ item, createFile, cancelCreating }: NewFileProps) => {
  const [fileName, setFileName] = useState('');

  const handleCreate = () => {
    createFile(fileName + '.md')
  }
  
  return (
    <div className='border-b border-[#ccc]'>
      <div className='my-1 cursor-pointer flex items-center justify-between' style={{ marginLeft: `${getIntend(item.path) * 8 + 8}px` }}> 
        <div className='flex items-center'>
          <FontAwesomeIcon className='mr-2' icon={faFile} />
          <input 
            value={fileName} 
            onChange={(e) => setFileName(e.target.value)} 
            placeholder='File name' 
            className='w-[80%]'/>
        </div>
        <div className='mr-3 flex'>
          <FontAwesomeIcon className='justify-end mr-2' icon={faCheckSquare} onClick={handleCreate}/>
          <FontAwesomeIcon className='justify-end' icon={faRectangleXmark} onClick={cancelCreating} />
        </div>
      </div>
    </div>
  )
}

const SideBarButton = ({item, openFile, removeFile, createFile, renameFile , openedFile, setOpenedFile}: SideBarButtonProps) => {
  const [creating, setCreating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [fileName, setFileName] = useState(item.name);

  const handleOpen = () => {
    if(item.type === 'file') {
      openFile(item.path)
      setOpenedFile(item.path)
    }
  }

  const handleRemove = () => {
    removeFile(item.path)
  }

  const handleEdit = () => {
    renameFile(item.path, fileName);
    setIsEditingName(false)
  }

  const setEditing = () => {
    handleOpen()
    setIsEditingName(true)
  }

  const handleCreate = (fileName: string) => {
    if(fileName) {
      createFile(item.path + '/' + fileName)
      setCreating(false)
    }
  }

  const cancelCreating = () => {
    setCreating(false)
  }

  useEffect(() => {
    if(openedFile !== item.path) {
      setIsEditingName(false)
    }
  }, [openedFile, setIsEditingName, item.path])

  
  return <div key={item.name}>
    <div className={`border-b border-[#ccc] ${openedFile === item.path && 'bg-[#3b3b67]'}`}>
      <div className='my-1 cursor-pointer flex items-center justify-between' style={{ marginLeft: `${getIntend(item.path) * 8}px` }}> 
        <div onClick={handleOpen} className='w-full'>
          {item.type === 'file' && <FontAwesomeIcon className='mr-2' icon={faFile} />}
          {item.type === 'folder' && <FontAwesomeIcon  className='mr-2' icon={faFolder} />}
          {
            isEditingName ? (
              <input 
                value={fileName} 
                onChange={(e) => setFileName(e.target.value)} 
                placeholder='File name' 
                className='w-[80%]'
                autoFocus
              />
            ) : (
              item.name 
            )
          }
        </div>
        <div className='mr-3'>
          {item.type === 'file' && 
            <div className='flex'>
              {
                isEditingName ? (
                  <>
                    <FontAwesomeIcon className='justify-end mr-2' icon={faCheckSquare} onClick={handleEdit}/>
                    <FontAwesomeIcon className='justify-end' icon={faRectangleXmark} onClick={() => setIsEditingName(false)}/>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon className='justify-end mr-2' icon={faPenToSquare} onClick={setEditing}/>
                    <FontAwesomeIcon className='justify-end' icon={faTrashCan} onClick={handleRemove}/>
                  </>
                )
              }
              
            </div>
          }
          {item.type === 'folder' && 
            <FontAwesomeIcon className='justify-end' icon={faPlusSquare} onClick={() => setCreating(true)}/>
          }
        </div>
      </div>
    </div>
    {
      creating && (
        <NewFile item={item} cancelCreating={cancelCreating} createFile={handleCreate} />
      )
    }
    {item.children && 
      item.children.map((kid) => 
        <SideBarButton 
          key={kid.name} 
          item={kid} 
          removeFile={removeFile} 
          openFile={openFile} 
          createFile={createFile} 
          openedFile={openedFile}
          setOpenedFile={setOpenedFile}
          renameFile={renameFile}
        />
      )
    }
  </div>
}

const SideBar = ({folderStructure, openFile, removeFile, renameFile, createFile, openedFile, setOpenedFile, isConfigPage, setIsConfig}: SideBarProps) => {

  const content = folderStructure.content?.map((item) => {
    return (
      <SideBarButton 
        key={item.name} 
        item={item} 
        openFile={openFile} 
        removeFile={removeFile} 
        renameFile={renameFile}
        createFile={createFile} 
        setOpenedFile={setOpenedFile}
        openedFile={openedFile}  
      />
    )
  })

  return <div className='side-bar'>
    <div 
      className={`pt-1 border-b border-[#ccc] flex ${isConfigPage && 'bg-[#3b3b67]'} cursor-pointer`}
      onClick={() => { setIsConfig(true); setOpenedFile('') }}
    >
      <div className='ml-2 w-[20px] h-[20px] mr-2'>
        <Settings />
      </div>
      Config
    </div>
    {content}
  </div>
}

export default SideBar;