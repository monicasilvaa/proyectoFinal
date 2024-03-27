import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, userData } from "../../pages/userSlice";
import "./AdminHeader.css";

export const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userRdxData = useSelector(userData)

  const token = userRdxData?.credentials?.token
  const decoded = userRdxData?.credentials?.userData
  const userRole = userRdxData?.credentials?.userData?.userRole

  const logMeOut = () => {
    dispatch(logout({credentials: {}}))
    
  };

  return (
    <>
      <Navbar sticky="top" key="sm" expand="sm" className="bg-body-tertiary mb-3">
          <Container>
            <Navbar.Toggle aria-controls="navbarMobile" className="me-auto ms-0 w-auto"/>
            <Navbar.Brand className="me-auto" href="#">Admin</Navbar.Brand>
            <Navbar.Offcanvas
              id="navbarMobile"
              aria-labelledby="navbarMobileLabel"
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="navbarMobileLabel">
                  Admin
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav navbarScroll className="justify-content-center flex-grow-1 pe-3">
                  {userRole == "superadmin" ?
                  <>
                    <Nav.Link href="/admin/users">Usuarios</Nav.Link>
                    <Nav.Link href="/admin/appointments">Citas</Nav.Link>
                  </>
                  : null}
                  {userRole == "dietitian" ?
                      <Nav.Link href="/admin/clients">Clientes</Nav.Link>
                    : null}
                </Nav>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavDropdown title="Mi cuenta" id="navbarScrollingDropdown">
                      {!token ? (
                        <>
                          <NavDropdown.Item href="/login">Iniciar sesión</NavDropdown.Item>
                          <NavDropdown.Item href="/register">Resgistrarse</NavDropdown.Item>
                        </>
                      ) : decoded.userRole === "superadmin" ? (
                        <>
                          <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
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
