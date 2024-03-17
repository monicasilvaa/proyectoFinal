import { Card } from 'react-bootstrap';
import './ImageCard.css';

export const ImageCard = ({imageUrl, title, text}) => {
  return (
    <>
      <Card className="col-xl-3 col-lg-6 col-md-6 mx-3 mb-5 p-0">
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {text}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};