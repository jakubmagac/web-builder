import { CardActions, Button, CardContent, Card, Typography } from "@mui/material";

const RemoveModal = ({ closeModal, handleRemove }) => {
  return (
    <div className="absolute top-0 h-full w-full flex items-center justify-center">
      <Card className="w-96 relative z-10">
        <CardContent>
          <Typography>
            Are you sure you want to delete file
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" className="mr-2" onClick={handleRemove}>Yes</Button>
          <Button variant="outlined" onClick={closeModal}>No</Button>
        </CardActions>
      </Card> 
    </div>
  )
}

export default RemoveModal;