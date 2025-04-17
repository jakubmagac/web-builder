import { CardActions, Button, CardContent, Card, Typography } from "@mui/material";

const RemoveModal = ({ type, closeModal, handleRemoveFile, handleRemoveFolder }) => {
  const remove = () => {
    if(type === 'file') {
      handleRemoveFile();
    } else {
      handleRemoveFolder();
    }
  }
  return (
    <div className="absolute top-0 h-full w-full flex items-center justify-center">
      <Card className="w-96 relative z-10">
        <CardContent>
          <Typography>
            Are you sure you want to delete {type === 'file' ? 'file' : 'folder'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" className="mr-2" onClick={remove}>Yes</Button>
          <Button variant="outlined" onClick={closeModal}>No</Button>
        </CardActions>
      </Card> 
    </div>
  )
}

export default RemoveModal;