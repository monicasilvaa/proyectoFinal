import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, userData } from "../../pages/userSlice";
import { getUserById } from "../../services/apiCalls";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userRdxData = useSelector(userData)
  const [clientId, setClientId] = useState(false);

  const token = userRdxData.credentials.token
  const decoded = userRdxData.credentials.userData

  useEffect(() => {
    if(decoded)
    {
      getUserById(token, decoded.userId)
      .then((res) => {
        if(res.client){
          setClientId(res.client.id);
        }
      });  
    } 
    
  })

  const logMeOut = () => {
    dispatch(logout({credentials: {}}))
    setTimeout(() => {
      navigate("/login");
    },1500);
  };

  return (
    <>
      <Navbar fixed="top" key="sm" expand="sm" className="bg-body-tertiary mb-3">
          <Container>
            <Navbar.Toggle aria-controls="navbarMobile" className="me-auto ms-0 w-auto"/>
            <Navbar.Brand className="me-auto" href="#">Mónica Silva</Navbar.Brand>
            <Navbar.Offcanvas
              id="navbarMobile"
              aria-labelledby="navbarMobileLabel"
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="navbarMobileLabel">
                  Mónica Silva
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav navbarScroll className="justify-content-center flex-grow-1 pe-3">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/#dietistas">Diestistas</Nav.Link>
                  <Nav.Link href="/#centros">Centros</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                  <NavDropdown title="Mi cuenta" id="navbarScrollingDropdown">
                      {!token ? (
                        <>
                          <NavDropdown.Item href="/login">Iniciar sesión</NavDropdown.Item>
                          <NavDropdown.Item href="/register">Resgistrarse</NavDropdown.Item>
                        </>
                      ) : decoded.userRole === "superadmin" ? (
                        <>
                          <NavDropdown.Item href="profile">Perfil</NavDropdown.Item>
                          <NavDropdown.Item href="/admin/dashboard">Admin</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={() => logMeOut()}>Cerrar sesión</NavDropdown.Item>
                        </>
                      ) : decoded.userRole === "dietitian" ? (
                          <>
                            <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                            <NavDropdown.Item href="/dietitianAppointments">Mis citas</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/dashboard">Admin</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => logMeOut()}>Cerrar Sesión</NavDropdown.Item>
                          </>
                                    
                      ) : (
                        <>
                          <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                          <NavDropdown.Item href="/myAppointments">Mis citas</NavDropdown.Item>
                          {clientId ?
                            <NavDropdown.Item href={"/dietplans/" + clientId}>Mis planes</NavDropdown.Item>                        
                          :null}
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={() => logMeOut()}>Log out</NavDropdown.Item>
                        </>
                      )}
                  </NavDropdown>
                </Nav>   
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
};
