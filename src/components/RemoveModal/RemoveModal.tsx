import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  Typography 
} from "@material-tailwind/react";

const RemoveModal = ({ closeModal, handleRemove }) => {
  return (
    <div className="absolute top-0 h-full w-full flex items-center justify-center">
      <Card className="w-96 relative z-10">
        <CardBody>
          <Typography>
            Are you sure you want to delete file
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="solid" className="mr-2" onClick={handleRemove}>Yes</Button>
          <Button variant="outline" onClick={closeModal}>No</Button>
        </CardFooter>
      </Card> 
    </div>
  )
}

export default RemoveModal;