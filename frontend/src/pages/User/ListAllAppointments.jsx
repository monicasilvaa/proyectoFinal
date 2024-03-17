import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { Sidebar } from "../../components/Sidebar/Sidebar";

import {
  appointmentCreate,
  appointmentUpdate,
  deleteAppointment,
  getAppointmentById,
  getAppointments, getCentersList,
  getClientsList,
  getDietitiansByCenterId,
  getServicesList
} from "../../services/apiCalls";
import { userData } from "../userSlice";

export const ListAllAppointments = () => {
  const [show, setShow] = useState(false);
  const userRdxData = useSelector(userData)
  const [appointmentId, setId] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});
  const token = userRdxData.credentials.token
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const [servicesData, setServicesData] = useState(false);
  const [centersData, setCentersData] = useState(false);
  const [dietitiansData, setDietitiansData] = useState(false);
  const [clientsDta, setClientsData] = useState(false);

  const handleClose = () => {
    setShow(false);
    getAppointments(token)
    .then((res) => {
        setAppointmentsData(res.results);
      })    
  }
  const handleShow = (id = false) => {
    setShow(true);
    setMessage(false);
    setError(false);

    if(id){
      setId(id);

      getAppointmentById(token,id)
      .then((res) => {
          setAppointmentData(res);    
      })

      getDietitiansByCenterId(appointmentData.center.id)
      .then((data) => {
        setDietitiansData(data);
      })
    }
  }

  const cancelAppointment = (event) => {
    setMessage(false);
    setError(false);
    deleteAppointment(token, appointmentData.id)
    .then((response) => {
      setMessage(response.message);
      setTimeout(handleClose, 2000);
    })
    .catch((err) => {
      setError(err.message);
    });  
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
      [event.target.name]: event.target.value,
    }));
  };
  
  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
        
    setMessage(false);
    setError(false);

    if(appointmentId){
        appointmentUpdate(token, appointmentId, appointmentData)
        .then((response) => {
            setMessage(response.message);   
        })
        .catch((err) => {
          setError(err.message);
        });    
    } else {
       //Se procede con el login
      appointmentCreate(token, appointmentData)
      .then((response) => {
          if(typeof response.id !== "undefined") {
            setMessage(response.message);
          }   
      })
      .catch((err) => {
        setError(err.message);
      });  
    }

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

     //Obtener clientes
     getClientsList()
     .then((res) => {
       setClientsData(res.results);
     })

    getAppointments(token)
    .then((res) => {
        setAppointmentsData(res.results);
      })    
  }, []);


  return (
    <>
      <div className="row">
        <Sidebar />
        <div className="col col-md-9 col-xl-10 px-4">
          <div className="appointments-btn-container">
              <Button variant="primary" className="w-auto" onClick={handleShow}>
                Nueva cita
              </Button>
            </div>

          {appointmentsData.length > 0 ? 
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Dietista</th>
                    <th>Servicio</th>
                    <th>Centro</th>
                    <th>Fecha cita</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsData.map(function(data) {
                      return (
                        <tr key={data.id} onClick={() => {handleShow(data.id)}}>
                          <td key={data.client.user.username}>{data.client.user.username}</td>
                          <td key={data.dietitian.user.username}>{data.dietitian.user.username}</td>
                          <td key={data.service.name}>{data.service.name}</td>
                          <td key={data.center.id}>{data.center.address}</td>
                          <td key={data.appointment_date}>{data.appointment_date}</td>
                        </tr>            
                      )
                  })}
                  </tbody>
                </Table>
            : 
            <p>Actualmente no existen citas</p>
          }
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear/Modificar cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? 
              <p className="danger">{error}</p>  
          :
              <p className="success">{message}</p>
          }
          <Form className="shadow p-4 bg-white rounded" onSubmit={submitHandler}>
                <Form.Select aria-label="Centro" value={appointmentData?.center?.id} name={"center"} onChange={selectHandler}>
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
                <Form.Select aria-label="Dietista" value={appointmentData?.dietitian?.id} name={"dietitian"} onChange={inputHandler}>
                  <option>Dietista</option>
                  {dietitiansData.length > 0 ? 
                    dietitiansData.map(function(data) {
                        return (
                          <option key={data.id} value={data.id}>{data.user.first_name} {data.user.last_name}</option>
                        )
                    })
                    : "Sin Dietistas"
                  }
                </Form.Select>

                <Form.Select aria-label="Servicio" value={appointmentData?.service?.id} name={"service"} onChange={inputHandler}>
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

                {appointmentData.id ? (
                  <Form.Select aria-label="Cliente" name={"client"} onChange={inputHandler}>
                    <option>Cliente</option>
                    {clientData.length > 0 ? 
                      clientData.map(function(data) {
                          return (
                            <option key={data.id} value={data.id}>{data.user.first_name} {data.user.last_name}</option>
                          )
                      })
                      : "Sin clientes"
                    }
                  </Form.Select>
                ) : null}

                <CustomInput type={"datetime-local"} value={appointmentData.appointment_date} name={"appointment_date"} placeholder="Fecha para cita" handler={inputHandler}></CustomInput>
            
                <Button className="w-auto" variant="primary" type="submit" >
                        Reservar
                    </Button>

                {appointmentData.id ? (
                  <Button className="w-auto" variant="primary" onClick={() => {cancelAppointment(appointmentData.id)}} >
                    Anular
                  </Button>  
                ) : null}
              
            </Form>

        </Modal.Body>
      </Modal>
    </>
  )
}