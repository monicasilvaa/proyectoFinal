import { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row, Table } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from "react-redux";
import { CustomInput } from "../../components/CustomInput/CustomInput";
  
import {
  deleteUser,
  getAvailableRoles,
  getUserById,
  getUsers,
  userCreate,
  userUpdate
} from "../../services/apiCalls";
import { userData } from "../userSlice";

export const ListAllUsers = () => {
  const userRdxData = useSelector(userData);
  const token = userRdxData.credentials.token
  const currentUserId = userRdxData.credentials.userData.userId;
  const userRole = userRdxData.credentials.userData.userROle;

  const [show, setShow] = useState(false);
  const [showCreate, setCreateShow] = useState(false);
  const [profileId, setId] = useState(false);
  const [usersData, setUsersData] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [availableRoles, setAvailableRoles] = useState({});
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);

  const handleCreateClose = () => setCreateShow(false);
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

  const handleCreateShow = () => {
    setCreateShow(true);

    setMessage(false);
    setError(false);

    getAvailableRoles(token)
    .then((res) => {
        setAvailableRoles(res.results);
    })
  }

  const inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    setProfileData((prevState) => {
      if(name.includes('.')) {
        const [parent, child] = name.split('.');
        
        return {
          ...prevState,
          [parent]: {
            ...prevState[parent],
            [child]: value
          }
        }
      }
      else {
        return {
          ...prevState,
          [name]: value,
        }
      }
    
    });
  };
  
  const selectHandler = (event) => {
    inputHandler(event);
  };

  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
        
    setError(false);
    setMessage(false);

    userUpdate(token, profileId, profileData)
      .then((response) => {
          setMessage(response.message);   
      })
      .catch((err) => {
        setError(err.message);
      });
      
  };

  const removeUser = async (event) => {
    event.preventDefault();

    deleteUser(token, profileId)
      .then((response) => {
          setMessage(response.message);  
    
          getUsers(token)
          .then((res) => {
              setUsersData(res.results);
            })   
    
          setTimeout(handleClose, 3000);
      })
      .catch((err) => {
        setError(err.message);
      });
      
  };

  const submitCreateHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
    
    setError(false);
    setMessage(false);

      userCreate(token, profileData)
      .then((response) => {
          setMessage(response.message);   
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    //Obtener usuarios
    getUsers(token)
    .then((res) => {
        setUsersData(res.results);
      })    
  }, []);


  return (
    <Container>
      <Row>
        <Col className="d-flex">
          <Button variant="dark" className="w-auto ms-auto me-0" onClick={handleCreateShow}>
            Crear usuario
          </Button>
        </Col>
      </Row>
      <div className="row">
        <div className="col py-3 mx-2">
          {usersData.length > 0 ? 
              <Table responsive striped bordered hover>
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
              <Alert variant="warning" >{error}</Alert>
          : null}

        {message ?
              <Alert variant="success" >{message}</Alert>
          : null}
          <Form className="text-center shadow p-4 bg-white rounded" onSubmit={submitHandler}>
              <CustomInput type={"text"} name={"first_name"} value={profileData.first_name} placeholder="Nombre" handler={inputHandler} ></CustomInput>
              <CustomInput type={"text"} name={"last_name"} value={profileData.last_name} placeholder="apellido" handler={inputHandler} ></CustomInput>
              <CustomInput type={"email"} name={"email"} value={profileData.email} placeholder="email" handler={inputHandler} ></CustomInput>
              <CustomInput type={"password"} name={"password"} value={profileData.password} placeholder="contraseña" handler={inputHandler} ></CustomInput>
              <CustomInput type={"phone"} name={"phone"} value={profileData.phone} placeholder="Móvil" handler={inputHandler} ></CustomInput>
              <CustomInput type={"date"} name={"birthday_date"} value={profileData.birthday_date} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
          
               {/* Sección adicional para usuarios tipo dietista */}
               {profileData.role?.id == '3' ? (
                <>
                  <CustomInput type={"text"} required="required" name={"dietitian.specialization"} value={profileData.dietitian?.specialization} placeholder="Especialización" handler={inputHandler} />
                </>
              ) : null}

              {/* Sección adicional para usuarios tipo cliente */}
              {profileData.role?.id == '2' ? (
                <>
                  <CustomInput type={"text"} name={"client.weight"} required="required" value={profileData.client?.weight} placeholder="Peso" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.height"} required="required" value={profileData.client?.height} placeholder="Altura" handler={inputHandler} />
                  <CustomInput type={"number"} name={"client.age"} required="required" value={profileData.client?.age} placeholder="Edad" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.gender"} required="required" value={profileData.client?.gender} placeholder="Género" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.pathology"} required="required" value={profileData.client?.pathology} placeholder="Patología" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.intolerance"} required="required" value={profileData.client?.intolerance} placeholder="Intolerancia" handler={inputHandler} />
                </>
              ) : null }

              <Row>
                <Col>
                  {profileId != currentUserId && userRole == "superadmin" ? (
                    <Button variant="outline-danger" onClick={removeUser}>
                        Borrar usuario
                    </Button>
                  ) : null }
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                      Actualizar
                  </Button>
                </Col>
              </Row>
              
          </Form>

        </Modal.Body>
      </Modal>

      <Modal show={showCreate} onHide={handleCreateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error ?
              <Alert variant="warning" >{error}</Alert>
          : null}

        {message ?
              <Alert variant="success" >{message}</Alert>
          : null}
          
          <Form className="text-center shadow p-4 bg-white rounded" onSubmit={submitCreateHandler}>
              <CustomInput type={"text"} name={"username"} value={profileData.username} placeholder="Username" handler={inputHandler} ></CustomInput>
              <CustomInput type={"text"} name={"first_name"} value={profileData.first_name} placeholder="Nombre" handler={inputHandler} ></CustomInput>
              <CustomInput type={"text"} name={"last_name"} value={profileData.last_name} placeholder="apellido" handler={inputHandler} ></CustomInput>
              <CustomInput type={"email"} name={"email"} value={profileData.email} placeholder="email" handler={inputHandler} ></CustomInput>
              <CustomInput type={"password"} name={"password"} value={profileData.password} placeholder="contraseña" handler={inputHandler} ></CustomInput>
              <CustomInput type={"phone"} name={"phone"} value={profileData.phone} placeholder="Móvil" handler={inputHandler} ></CustomInput>
              <CustomInput type={"date"} name={"birthday_date"} value={profileData.birthday_date} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
              <Form.Select className="my-2" aria-label="Role" name={"role"} value={profileData.role?.id} onChange={selectHandler}>
                    <option>Role</option>
                    {availableRoles.length > 0 ? 
                      availableRoles.map(function(data) {
                          return (
                            <option key={data.id} value={data.id}>{data.name}</option>
                          )
                      })
                      : "Sin roles para asignar"
                    }
                </Form.Select>
               {/* Sección adicional para usuarios tipo dietista */}
              {profileData.role == "3" ? (
                <>
                  <CustomInput type={"text"} required="required" name={"dietitian.specialization"} value={profileData.dietitian?.specialization} placeholder="Especialización" handler={inputHandler} />
                </>
              ) : null}

              {/* Sección adicional para usuarios tipo cliente */}
              {profileData.role == "2" ? (
                <>
                  <CustomInput type={"text"} name={"client.weight"} required="required" value={profileData.client?.weight} placeholder="Peso" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.height"} required="required" value={profileData.client?.height} placeholder="Altura" handler={inputHandler} />
                  <CustomInput type={"number"} name={"client.age"} required="required" value={profileData.client?.age} placeholder="Edad" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.gender"} required="required" value={profileData.client?.gender} placeholder="Género" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.pathology"} required="required" value={profileData.client?.pathology} placeholder="Patología" handler={inputHandler} />
                  <CustomInput type={"text"} name={"client.intolerance"} required="required" value={profileData.client?.intolerance} placeholder="Intolerancia" handler={inputHandler} />
                </>
              ) : null }

              <Button variant="primary" type="submit">
                  Actualizar
              </Button>
          </Form>

        </Modal.Body>
      </Modal>
    </Container>
  )
}