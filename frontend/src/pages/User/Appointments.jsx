import { useEffect, useState } from "react";
import { Alert, Button, Form, Offcanvas, Table } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import {
  appointmentCreate,
  getAppointmentById,
  getAppointmentsByClient, getCentersList,
  getDietitiansByCenterId,
  getServicesList,
  getUserById
} from "../../services/apiCalls";
import { userData } from "../userSlice";
import "./Appointments.css";

export const Appointments = () => {
  const [formError, setFormError] = useState(false);
  const [formShow, setFormShow] = useState(true);
  const [formSuccess, setFormSuccess] = useState(true);
  const [appointmentData, setAppointmentData] = useState({});
  const [appointmentsData, setAppointmentsData] = useState(false);
  const [appointmentReadData, setAppointmentReadData] = useState({});
  const [centersData, setCentersData] = useState(false);
  const [dietitiansData, setDietitiansData] = useState(false);
  const [servicesData, setServicesData] = useState(false);
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const userRdxData = useSelector(userData)
  const token = userRdxData.credentials.token

  const handleClose = () => closeForm();
  const handleShow = () => showForm(true);
  const handleModalClose = () => setModalShow(false);

  
  const handleModalShow = (appointmentId) => {
    setAppointmentReadData({});
    setModalShow(true);
    getAppointmentById(token, appointmentId)
    .then((res) => {
      setAppointmentReadData(res);
    })
  }
  const selectHandler = (event) => {
    setAppointmentData({});
    getDietitiansByCenterId(event.target.value)
    .then((res) => {
      setDietitiansData(res);
    })

    inputHandler(event);
  };

  const inputHandler = (event) => {
    setAppointmentData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
    }))

  }

  const showForm = (event) => {
    setAppointmentData({});
    setShow(true);
    setFormShow(true);
    setFormError(false);
  }
  
  const closeForm = (event) => {
    setShow(false);
    
    //Obtener citas del cliente
    getAppointmentsByClient(token)
    .then((res) => {
        setAppointmentsData(res.clientAppointments);
    })
  }
    

  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
        
    appointmentData.modified_by = userRdxData.credentials.userData.userId;

    getUserById(token, userRdxData.credentials.userData.userId)
    .then((res) => {
        appointmentData.client = res.client.id;

        appointmentCreate(token, appointmentData)
        .then((response) => {
              setFormError(false);
              setFormShow(false);
              setFormSuccess(true);
        })
        .catch((err) => {
          setFormSuccess(false);
          setFormError(true)
        });    
      })


  };


  useEffect(() => {
    //Obtener centros
    getCentersList()
    .then((res) => {
        setCentersData(res.results);
      })    

    //Obtener servicios
    getServicesList()
    .then((res) => {
      setServicesData(res.results);
    })
//Obtener citas del cliente
getAppointmentsByClient(token)
.then((res) => {
    setAppointmentsData(res.clientAppointments);
  })

  }, []);


  return (
    <div className="profileDesign mt-5 pt-5">
        <div className="miDiv bg-white rounded shadow col-12 col-sm-8 col-md-6 mt-5 p-4">
          <div className="appointments-btn-container mx-3">
            <Button variant="primary" className="w-auto" onClick={handleShow}>
              Nueva cita
            </Button>
          </div>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Nueva cita</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {formError ?
                <Alert variant="warning" >No se ha podido crear la cita, tenga en cuenta el horario del centro al hacer la solicitud e inténtelo de nuevo.</Alert>
              : null}

              {formShow? 
                <Form className="shadow p-4 bg-white rounded" onSubmit={submitHandler}>
                    <Form.Select className="my-2" aria-label="Centro" name={"center"} onChange={selectHandler}>
                      <option>Centro</option>
                      {centersData.length > 0 ? 
                        centersData.map(function(data) {
                            return (
                              <option key={data.id} value={data.id}>{data.address}</option>
                            )
                        })
                        : "Sin centros"
                      }
                    </Form.Select>
                    <Form.Select className="my-2" aria-label="Dietista" name={"dietitian"} onChange={inputHandler}>
                      <option>Dietista</option>
                      {dietitiansData.length > 0 ? 
                        dietitiansData.map(function(data) {
                            return (
                              <option key={data.id} value={data.id}>{data.user.first_name} {data.user.last_name}</option>
                            )
                        })
                        : "Sin dietistas"
                      }
                    </Form.Select>

                    <Form.Select className="my-2" aria-label="Servicio" name={"service"} onChange={inputHandler}>
                      <option>Servicio</option>
                      {servicesData.length > 0 ? 
                        servicesData.map(function(data) {
                            return (
                              <option key={data.id} value={data.id}>{data.name}</option>
                            )
                        })
                        : "Sin servicios"
                      }
                    </Form.Select>

                    <CustomInput type={"datetime-local"} name={"appointment_date"} placeholder="Fecha para cita" handler={inputHandler}></CustomInput>
                
                    <Button className="w-100" variant="primary" type="submit" >
                            Solicitar
                        </Button>
                </Form>
                : <Alert variant="success">La solicitud se ha realizado correctamente, en breve contactaremos contigo</Alert>
              }

            </Offcanvas.Body>
          </Offcanvas>
            {appointmentsData.length > 0 ? 
                <Table responsive className="table-sm m-2">
                  <thead>
                    <tr>
                      <th>Fecha cita</th>
                      <th>Centro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsData.map(function(data) {
                        return (
                          <tr key={data.id} onClick={() => {handleModalShow(data.id)}}>
                            <td key={data.appointment_date}>{data.appointment_date}</td>
                            <td key={data.center.address}>{data.center.address}</td>
                          </tr>            
                        )
                    })}
                    </tbody>
                  </Table>

                  
            : 
            <p>Actualmente no tienes citas</p>
            }

          <Modal show={modalShow} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Información de la cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {appointmentReadData ? (
                <>
                  <p>Dietatista: {appointmentReadData.dietitian?.user?.first_name} {appointmentReadData.dietitian?.user?.last_name}</p>
                  <p>Centro: {appointmentReadData.center?.address}</p>
                  <p>Fecha: {appointmentReadData.appointment_date}</p>
                  <p>Servicio: {appointmentReadData.service?.name}</p>
                </>
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="mx-auto" onClick={handleModalClose}>
                Volver
              </Button>
            </Modal.Footer>
          </Modal>
      </div>
    </div>
  )
}