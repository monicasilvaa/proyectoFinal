import { useEffect, useState } from "react";
import { Button, Form, Offcanvas, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import {
  appointmentCreate,
  getAppointmentsByClient,
  getAppointmentsByDietitian,
  getCentersList,
  getDietitiansByCenterId,
  getServicesList
} from "../../services/apiCalls";
import { userData } from "../userSlice";
import "./Appointments.css";

export const DietitiansAppointments = () => {
  
  const userRdxData = useSelector(userData)

  const [show, setShow] = useState(false);
  const [formShow, setFormShow] = useState(true);
  
  const [formError, setFormError] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});
  const [appointmentsData, setAppointmentsData] = useState(false);
  const [centersData, setCentersData] = useState(false);
  const [dietitiansData, setDietitiansData] = useState(false);
  const [servicesData, setServicesData] = useState(false);

  const handleClose = () => closeForm();
  const handleShow = () => showForm(true);

  const token = userRdxData.credentials.token

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

  const showForm = () => {
    setAppointmentData({});
    setShow(true);
    setFormShow(true);
    setFormError(false);
  }
  
  const closeForm = () => {
    setShow(false);
    
    //Obtener citas del cliente
    getAppointmentsByClient(token)
    .then((res) => {
        setAppointmentsData(res.employeeAppointments);
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
      .catch(() => {
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
    getAppointmentsByDietitian(token)
    .then((res) => {
        setAppointmentsData(res.employeeAppointments);
      })

  }, []);


  return (
    <>
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
                <Form.Select aria-label="Centro" name={"center_id"} onChange={selectHandler}>
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
                          <option key={data.id} value={data.id}>{data.first_name} {data.last_name}</option>
                        )
                    })
                    : "Sin dietistas"
                  }
                </Form.Select>

                <Form.Select aria-label="Servicio" name={"service_id"} onChange={inputHandler}>
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
                  <th>Cliente</th>
                  <th>Fecha cita</th>
                  <th>Centro</th>
                  <th>Servicio</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsData.map(function(data) {
                    return (
                      <tr key={data.id}>
                        <td key={data.clientUser.first_name}>{data.clientUser.first_name} {data.clientUser.last_name}</td>
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
    </>
  )
}