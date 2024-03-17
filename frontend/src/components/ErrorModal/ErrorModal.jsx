import Modal from 'react-bootstrap/Modal';

export const ErrorModal = ({status, message, show, handler}) => {

  return (
    <>
      <Modal
        size="sm"
        show={show}
        aria-labelledby="example-modal-sizes-title-sm"
        onHide={handler}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            {status}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
      </Modal>
    </>
  );
}