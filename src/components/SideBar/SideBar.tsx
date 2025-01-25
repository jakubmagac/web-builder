import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder } from '@fortawesome/free-regular-svg-icons';

import "./styles.css";

const SideBarButton = ({item, openFile}) => {
  const getIntend = (path: string) => {
    let count = 0;
    for (const char of path) {
      if (char === '/') count++;
    }
    return count - 1;
  }

  const handleOpen = () => {
    if(item.type === 'file') {
      openFile(item.path)
    }
  }

  return <div key={item.name} className='side-bar-button'>
    <div style={{ borderBottom: '1px solid #ccc' }} onClick={handleOpen}>
      <div style={{ marginLeft: `${getIntend(item.path) * 10}px`, marginBottom: '5px', marginTop: '5px', cursor: 'pointer' }}> 
        {item.type === 'file' && <FontAwesomeIcon icon={faFile} style={{ marginRight: '10px' }}/>}
        {item.type === 'folder' && <FontAwesomeIcon icon={faFolder} style={{ marginRight: '10px' }}/>}
        {item.name}
      </div>
    </div>
    {item.children && item.children.map((kid) => <SideBarButton key={kid.name} item={kid} openFile={openFile} />)}
  </div>
}


const SideBar = ({folderStructure, openFile}) => {
  const content = folderStructure.content?.map((item) => {
    return (
      <SideBarButton key={item.name} item={item} openFile={openFile} />
    )
  })

  return <div className='side-bar'>
    {content}
  </div>
}

export default SideBar;