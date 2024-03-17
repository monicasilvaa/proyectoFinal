import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from "react-redux";
import { logout, userData } from './../../pages/userSlice';
import { getUserById } from './../../services/apiCalls';
import './Sidebar.css';

export const Sidebar = (isAuthenticated) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(false);

  const userRdxData = useSelector(userData)
  const token = userRdxData.credentials.token;
  const userId = userRdxData.credentials.userData.userId;
  const dispatch = useDispatch()

  useEffect(() => {
    getUserById( token, userId)
    .then((data) => {
          setUser(
              {
                  username: data.username,
                  avatar: data.photo
              }
          );
      })
    .catch((err) => {
      console.log(err);
    }); 
  }, []);

  const logMeOut = () => {
    dispatch(logout({credentials: {}}))
    setTimeout(() => {
      navigate("/");
    });
  };

  return (
    <>
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-90">
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  <li className="nav-item">
                      <a href="/users" className="nav-link align-middle px-0">
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Usuarios</span>
                      </a>
                  </li>
                  <li className="nav-item">
                      <a href="/appointments" className="nav-link align-middle px-0">
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Gestionar citas</span>
                      </a>
                  </li>
                  
              </ul>
              <hr />
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        <img src={user.avatar} className="col-4 rounded-circle" />
                        <span className="d-none d-sm-inline mx-1">{user.username}</span>
                    </Dropdown.Toggle>
                  <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                      
                  </a>
                  <Dropdown.Menu>
                      <Dropdown.Item href="/profile">Perfil</Dropdown.Item>
                      <Dropdown.Item onClick={() => logMeOut()}>Log out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
          </div>
      </div>
    </>
  );
};

export default Sidebar;