import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { Sidebar } from "../../components/Sidebar/Sidebar";

import {
  getUserById,
  getUsers,
  userUpdate
} from "../../services/apiCalls";
import { userData } from "../userSlice";

export const ListAllUsers = () => {
  const [show, setShow] = useState(false);
  const userRdxData = useSelector(userData)
  const [profileId, setId] = useState(false);
  const [usersData, setUsersData] = useState(false);
  const [profileData, setProfileData] = useState({});
  const token = userRdxData.credentials.token
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setId(id);

    setMessage(false);
    setError(false);

    getUserById(token,id)
    .then((res) => {
        setProfileData(res);
    })
  }

  const inputHandler = (event) => {
    setProfileData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  
  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
        
    userUpdate(token, profileId, profileData)
      .then((response) => {
          setMessage(response.message);   
      })
      .catch((err) => {
        setError(err.message);
      });    
  };

  useEffect(() => {
    //Obtener centros
    getUsers(token)
    .then((res) => {
        setUsersData(res.results);
      })    
  }, []);


  return (
    <>
      <div className="row">
        <Sidebar />
        <div className="col py-3 mx-2">
          {usersData.length > 0 ? 
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Fecha registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map(function(data) {
                      return (
                        <tr key={data.id} onClick={() => {handleShow(data.id)}}>
                          <td key={data.username}>{data.username}</td>
                          <td key={data.role.name}>{data.role.name}</td>
                          <td key={data.email}>{data.email}</td>
                          <td key={data.register_date}>{data.register_date}</td>
                        </tr>            
                      )
                  })}
                  </tbody>
                </Table>
            : 
            <p>Actualmente no existen usuarios</p>
          }
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error ? 
              <p className="danger">{error}</p>  
          :
              <p className="success">{message}</p>
          }
          <Form className="text-center shadow p-4 bg-white rounded" onSubmit={submitHandler}>
              <CustomInput type={"text"} name={"first_name"} value={profileData.first_name} placeholder="Nombre" handler={inputHandler} ></CustomInput>
              <CustomInput type={"text"} name={"last_name"} value={profileData.last_name} placeholder="apellido" handler={inputHandler} ></CustomInput>
              <CustomInput type={"email"} name={"email"} value={profileData.email} placeholder="email" handler={inputHandler} ></CustomInput>
              <CustomInput type={"password"} name={"password"} value={profileData.password} placeholder="contraseña" handler={inputHandler} ></CustomInput>
              <CustomInput type={"phone"} name={"phone"} value={profileData.phone} placeholder="Móvil" handler={inputHandler} ></CustomInput>
              <CustomInput type={"date"} name={"birthday_date"} value={profileData.birthday_date} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
          
              <Button variant="primary" type="submit">
                  Actualizar
              </Button>
          </Form>

        </Modal.Body>
      </Modal>
    </>
  )
}