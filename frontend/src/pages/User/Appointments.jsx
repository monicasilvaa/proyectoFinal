import { useEffect, useState } from "react";
import { Button, Form, Offcanvas, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import {
  appointmentCreate,
  getAppointmentById,
  getAppointmentsByClient, getCentersList,
  getDietitiansByCenterId,
  getServicesList
} from "../../services/apiCalls";
import { userData } from "../userSlice";
import "./Appointments.css";

export const Appointments = () => {
  const navigate = useNavigate();
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formEditionShow, setFormEditionShow] = useState(false);
  const [formShow, setFormShow] = useState(true);
  const [appointment, setAppointment] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [appointmentsData, setAppointmentsData] = useState(false);
  const [centersData, setCentersData] = useState(false);
  const [dietitiansData, setDietitiansData] = useState(false);
  const [servicesData, setServicesData] = useState(false);
  const userRdxData = useSelector(userData)
  const [show, setShow] = useState(false);
  const handleClose = () => closeForm();
  const handleShow = () => showForm(true);

  const token = userRdxData.credentials.token
  const id = userRdxData.credentials.userData.userId

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

  const openFormEdition = (id) => {
    setFormShow(false);
    setFormEditionShow(true);
    appointmentData.id = id;

    getAppointmentById(token, id)
    .then((res) => {
      setFormShow(false);
      setFormError(false);
      setShow(true);
      setFormEditionShow(true);

        setAppointment(res);
    })
    
  }

  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
        
    appointmentData.modified_by = userRdxData.credentials.userData.userId;
    appointmentData.clientUser = userRdxData.credentials.userData.userId;

    //Se procede con el login
    appointmentCreate(token, appointmentData)
      .then((response) => {
          if(typeof response.id !== "undefined") {
            setFormError(false);
            setFormShow(false);
            setFormSuccess(true);
          }   
      })
      .catch((err) => {
        setFormSuccess(false);
        setFormError(true)
      });    
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
    <div className="profileDesign">
        <div className="miDiv">
          <div className="appointments-btn-container">
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
                <p className="danger">No se ha podido crear la cita, tenga en cuenta el horario del centro al hacer la solicitud e inténtelo de nuevo.</p>
              : ""}

              {formShow? 
                <Form className="shadow p-4 bg-white rounded" onSubmit={submitHandler}>
                    <Form.Select aria-label="Centro" name={"center"} onChange={selectHandler}>
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
                    <Form.Select aria-label="Dietista" name={"dietitian_id"} onChange={inputHandler}>
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

                    <Form.Select aria-label="Servicio" name={"service"} onChange={inputHandler}>
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
                : <p class="success">La solicitud se ha realizado correctamente, en breve contactaremos contigo</p>
              }

            </Offcanvas.Body>
          </Offcanvas>
            {appointmentsData.length > 0 ? 
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Dietista</th>
                      <th>Fecha cita</th>
                      <th>Centro</th>
                      <th>Servicio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsData.map(function(data) {
                        return (
                          <tr key={data.id}>
                            <td key={data.dietitian.user.first_name}>{data.dietitian.user.first_name} {data.dietitian.user.last_name}</td>
                            <td key={data.appointment_date}>{data.appointment_date}</td>
                            <td key={data.center.address}>{data.center.address}</td>
                            <td key={data.service.name}>{data.service.name}</td>
                          </tr>            
                        )
                    })}
                    </tbody>
                  </Table>
            : 
            <p>Actualmente no tienes citas</p>
            }
      </div>
    </div>
  )
}