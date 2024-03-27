import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../services/apiCalls";
import { loggedIn, login, logout, userData } from "../userSlice";

import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import "./Login.css";

export const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRdxData = useSelector(userData)
    const loginExpiration = userRdxData.credentials?.userData?.exp;
    
    if(loginExpiration != null) {
      verifyLoginExpiration(loginExpiration);
    }

    const isAuthenticated = useSelector(loggedIn);

    useEffect(() => {
      //Se comprueba si está logueado
      if (isAuthenticated) {
        navigate("/");
      } 
    }, []);

    const inputHandler = (event) => {
      //Se setean las credenciales
        setCredentials((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }))
    }

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
    
    setShow(false);
    setLoading(true);
    await delay(500);

    //Se procede con el login
    userLogin(credentials)
      .then((token) => {
        //Se decodifica el token obtenido en la petición
        const decodedToken = jwtDecode(token);

        const data = {
          token: token,
          userData: decodedToken,
        };

        dispatch(login({ credentials: data }));

        navigate("/");
      })
      .catch((err) => {

        setShow(true)
      });

    setLoading(false);
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function  verifyLoginExpiration(exp) {
    try {       
      // Verifica la expiración
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      
      if (exp && currentTime > exp) {
        dispatch(logout({ credentials: {} }));
      } 

    } catch (error) {
        console.error('Error al verificar la expiración del token:', error.message);
    }
  }

  return (
    <div
      className="loginContenedor mt-5"
    >
        <div className="loginBackdrop"></div>
        <Form className="shadow p-4 bg-white rounded" onSubmit={submitHandler}>
            <img
            className="img-thumbnail mx-auto d-block mb-2"
            src={Logo}
            alt="logo"
            />
            <div className="h4 mb-2 text-center">Acceder</div>
            {show ? (
            <Alert
                className="mb-2"
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
            >
                Usuario y/o contraseña incorrectos.
            </Alert>
            ) : 
              null
            }
            <Form.Group className="mb-2" controlId="email">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                    type="email"
                    name={"email"}
                    value={userData.email}
                    placeholder="Email"
                    onChange={inputHandler}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    name={"password"}
                    value={userData.password}
                    placeholder="Contraseña"
                    onChange={inputHandler}
                    required
                />
            </Form.Group>
            <br/>
            {!loading ? (
                <Button className="w-100" variant="primary" type="submit">
                    Entrar
                </Button>
            ) : (
                <Button className="w-100" variant="primary" type="submit" disabled>
                    Accediendo ...
                </Button>
            )}
            
      </Form>
    </div>
  );
};

export default Login;
