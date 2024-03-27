import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
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
    appointmentData.client = userRdxData.credentials.userData.userId;

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
    //Obtener citas del dietista
    getAppointmentsByDietitian(token)
    .then((res) => {
        setAppointmentsData(res.appointments);
      })

  }, []);


  return (
    <div className="profileDesign pt-5">
        <div className="miDiv mt-5 col-12 col-sm-8 col-md-6">
            {appointmentsData?.length > 0 ? 
                <Table responsive striped bordered hover>
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
                            <td key={data.client.id}>{data.client?.user?.first_name} {data.client?.user?.last_name}</td>
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