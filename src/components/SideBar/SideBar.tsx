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
  createFile: (path: string, options?: { root: boolean }) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  setOpenedFile: (fileName: string) => void;
  removeFile: (path: string) => Promise<void>;
  removeFolder: (path: string) => Promise<void>;
  renameFile: (path: string, fileName: string) => Promise<void>;
  renameFolder: (path: string, folderName: string) => Promise<void>;
}

interface SideBarButtonProps {
  createFile: (path: string) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  removeFile: (path: string) => Promise<void>;
  removeFolder: (path: string) => Promise<void>;
  renameFile: (path: string, fileName: string) => Promise<void>;
  renameFolder: (path: string, folderName: string) => Promise<void>;
  setCreatingFolder: (val: boolean) => void;
  setCreatingRootFile: (val: boolean) => void;
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
    if(fileName) {
      createFile(fileName + '.md')
    }
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

const SideBarButton = ({item, openFile, removeFile, removeFolder, createFile, renameFile, renameFolder , openedFile, setOpenedFile, setCreatingFolder, setCreatingRootFile}: SideBarButtonProps) => {
  const [creating, setCreating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingFolder, setIsEditingFolder] = useState(false);
  const [fileName, setFileName] = useState(item.name);
  const [folderName, setFolderName] = useState(item.name);

  const handleOpen = () => {
    if(item.type === 'file') {
      setCreatingFolder(false);
      setCreatingRootFile(false)
      openFile(item.path)
      setOpenedFile(item.path)
    }
  }

  const handleRemove = () => {
    removeFile(item.path)
  }

  const handleRemoveFolder = () => {
    removeFolder(item.path)
  }

  const handleEdit = () => {
    renameFile(item.path, fileName);
    setIsEditingName(false)
  }

  const handleEditFolder = () => {
    renameFolder(item.path, folderName);
    setIsEditingFolder(false)
    setFolderName(item.name)
  }

  const setEditing = () => {
    handleOpen()
    setIsEditingName(true)
  }

  const handleCreate = (fileName: string) => {
    if(fileName) {
      createFile(item.path + '/' + fileName)
      console.log(item.path + '/' + fileName)
      setCreating(false)
    }
  }

  const cancelCreating = () => {
    setCreating(false)
  }

  useEffect(() => {
    setCreatingFolder(false)
    setCreatingRootFile(false)

    if(openedFile !== item.path) {
      setIsEditingName(false)
    }
  }, [openedFile, setIsEditingName, item.path])

  
  return <div key={item.name}>
    <div 
      className={`border-b border-[#ccc] ${openedFile === item.path && 'bg-[#3b3b67]'}`}
    >
      <div 
        className='my-1 cursor-pointer flex items-center justify-between' 
        style={{ marginLeft: `${getIntend(item.path) * 8}px` }}
      > 
        <div 
          onClick={handleOpen} 
          className='w-full'
        >
          {item.type === 'file' && <FontAwesomeIcon className='mr-2' icon={faFile} />}
          {item.type === 'folder' && <FontAwesomeIcon  className='mr-2 text-amber-300' icon={faFolder} />}
          {
            isEditingName && (
              <input 
                value={fileName} 
                onChange={(e) => setFileName(e.target.value)} 
                placeholder='File name' 
                className='w-[80%]'
                autoFocus
              />
            )
           }
          { 
            isEditingFolder && (
              <input 
                value={folderName} 
                onChange={(e) => setFolderName(e.target.value)} 
                placeholder='Folder name' 
                className='w-[80%]'
                autoFocus
              />
            )
          }
          {
            !isEditingName && !isEditingFolder && (
              <span className={`${item.type === 'folder' && 'text-amber-300'}`}>
                {item.name}
              </span>
            )
          }
        </div>
        <div className='mr-3'>
          {item.type === 'file' && 
            <div className='flex'>
              {
                isEditingName ? (
                  <>
                    <FontAwesomeIcon 
                      className='justify-end mr-2' 
                      icon={faCheckSquare} 
                      onClick={handleEdit}
                    />
                    <FontAwesomeIcon 
                      className='justify-end' 
                      icon={faRectangleXmark} 
                      onClick={() => setIsEditingName(false)}
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon 
                      className='justify-end mr-2' 
                      icon={faPenToSquare} 
                      onClick={setEditing}
                    />
                    <FontAwesomeIcon 
                      className='justify-end' 
                      icon={faTrashCan} 
                      onClick={handleRemove}
                    />
                  </>
                )
              }
              
            </div>
          }
          {item.type === 'folder' && 
            <div className='flex'>
              {
                isEditingFolder ? (
                  <>
                    <FontAwesomeIcon 
                      className='justify-end mr-2' 
                      icon={faCheckSquare} 
                      onClick={handleEditFolder}
                    />
                    <FontAwesomeIcon 
                      className='justify-end' 
                      icon={faRectangleXmark} 
                      onClick={() => setIsEditingFolder(false)}
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon 
                      className='mr-2' 
                      icon={faPlusSquare} 
                      onClick={() => setCreating(true)}
                    />
                    <FontAwesomeIcon 
                      className='mr-2' 
                      icon={faPenToSquare} 
                      onClick={() => setIsEditingFolder(true)}
                    />
                    <FontAwesomeIcon 
                      className='justify-end' 
                      icon={faTrashCan} 
                      onClick={handleRemoveFolder}
                    />
                  </>
                )
              }
              
            </div>
          }
        </div>
      </div>
    </div>
    {
      creating && (
        <NewFile 
          item={item} 
          cancelCreating={cancelCreating} 
          createFile={handleCreate} 
        />
      )
    }
    {item.children && 
      item.children.map((kid) => 
        <SideBarButton 
          key={kid.name} 
          item={kid} 
          removeFile={removeFile} 
          removeFolder={removeFolder} 
          openFile={openFile} 
          createFile={createFile} 
          openedFile={openedFile}
          setOpenedFile={setOpenedFile}
          setCreatingFolder={setCreatingFolder}
          setCreatingRootFile={setCreatingRootFile}
          renameFile={renameFile}
          renameFolder={renameFolder}
        />
      )
    }
  </div>
}

const SideBar = ({
  folderStructure, 
  openFile, 
  removeFile, 
  removeFolder,
  renameFile, 
  renameFolder,
  createFile, 
  openedFile, 
  setOpenedFile, 
  isConfigPage, 
  setIsConfig,
  createFolder,
}: SideBarProps) => {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [creatingRootFile, setCreatingRootFile] = useState(false)
  const [folderName, setFolderName] = useState('');
  const [rootFileName, setRootFileName] = useState('');

  const content = folderStructure.content?.map((item) => {
    return (
      <SideBarButton 
        key={item.name} 
        item={item} 
        openFile={openFile} 
        removeFile={removeFile} 
        removeFolder={removeFolder}
        renameFile={renameFile}
        renameFolder={renameFolder}
        createFile={createFile} 
        setOpenedFile={setOpenedFile}
        setCreatingFolder={setCreatingFolder}
        setCreatingRootFile={setCreatingRootFile}
        openedFile={openedFile}  
      />
    )
  })

  return <div className='side-bar max-h-screen overflow-y-auto'>
    <div 
      className={`pt-1 border-b border-[#ccc] flex ${isConfigPage && 'bg-[#3b3b67]'} cursor-pointer`}
      onClick={() => { setIsConfig(true); setOpenedFile(''); setCreatingRootFile(false); setCreatingFolder(false) }}
    >
      <div className='ml-2 w-[20px] h-[20px] mr-2'>
        <Settings />
      </div>
      Config
    </div>
    {content}
    {
      creatingFolder && (
        <div className='bg-[#3b3b67] flex items-center'>
          <FontAwesomeIcon  className='mx-2' icon={faFolder} />

          <input 
            value={folderName} 
            onChange={(e) => setFolderName(e.target.value)} 
            placeholder='Folder name' 
            className='w-[80%]'
            autoFocus
          />
          <div className='flex mr-3'>
            <FontAwesomeIcon 
              className='mr-2 cursor-pointer' 
              icon={faCheckSquare} 
              onClick={() => { 
                if(folderName) {
                  createFolder(folderName); 
                  setCreatingFolder(false)
                  setFolderName('')
                }
              }}
            />
            <FontAwesomeIcon 
              className='cursor-pointer' 
              icon={faRectangleXmark} 
              onClick={() => { setCreatingFolder(false); setFolderName('') }}
            />
          </div>
        </div>
      )
    }
    {
      creatingRootFile && (
        <div className='bg-[#3b3b67] flex items-center'>
          <FontAwesomeIcon  className='mx-2' icon={faFile} />

          <input 
            value={rootFileName} 
            onChange={(e) => setRootFileName(e.target.value)} 
            placeholder='File name' 
            className='w-[80%]'
            autoFocus
          />
          <div className='flex mr-3'>
            <FontAwesomeIcon 
              className='mr-2 cursor-pointer' 
              icon={faCheckSquare} 
              onClick={() => { 
                if(rootFileName) {
                  createFile(rootFileName + '.md', { root: true })
                  setCreatingFolder(false)
                  setRootFileName('')
                }
              }}
            />
            <FontAwesomeIcon 
              className='cursor-pointer' 
              icon={faRectangleXmark} 
              onClick={() => { setCreatingRootFile(false); setRootFileName('') }}
            />
          </div>
        </div>
      )
    }
    {
      !creatingFolder && (
        <div 
        className='cursor-pointer flex items-center justify-center'
        onClick={() => { setOpenedFile(''); setCreatingRootFile(false); setCreatingFolder(true) }}
       >
         ... Add folder
         <FontAwesomeIcon 
           className='ml-2' 
           icon={faPlusSquare} 
         />
       </div>
      )
    }
    {
      !creatingRootFile && (
        <div 
        className='cursor-pointer flex items-center justify-center'
        onClick={() => { setOpenedFile(''); setCreatingRootFile(true); setCreatingFolder(false) }}
       >
         ... Add file
         <FontAwesomeIcon 
           className='ml-2' 
           icon={faPlusSquare} 
         />
       </div>
      )
    }
  </div>
}

export default SideBar;