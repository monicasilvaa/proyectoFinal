import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { registerClient } from "../../services/apiCalls";



export const Register = () => {

    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email:'',
        password: '',
        phone: '',
        birthday_date: ''
    })

    const navigate = useNavigate();


    const inputHandler = (event) => {
        setUserData((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }))
    }

    useEffect (() => {

    
    }, [])


    const submitHandler = async (event) => {
        //Handler envío de formulario
        event.preventDefault();
            
        //Se procede con el login
        registerClient(userData)
          .then((response) => {
            navigate("/login");
          })
          .catch((err) => {

        });    
      };

    return (
        <Container className="mt-5 pt-5">
            <div className="miDiv bg-white rounded p-4">
            <h2 className="mt-4 mb-0">Perfil</h2>
            <hr/>
                <Form className="shadow p-4" onSubmit={submitHandler}>
                    <CustomInput type={"text"} value={userData.username} name={"username"} placeholder="username" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"text"} value ={userData.first_name} name={"first_name"} placeholder="Nombre" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"text"} value ={userData.last_name} name={"last_name"} placeholder="apellido" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"email"} value ={userData.email} name={"email"} placeholder="email" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"password"} value ={userData.password} name={"password"} placeholder="contraseña" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"phone"} value ={userData.phone} name={"phone"} placeholder="Móvil" handler={inputHandler} ></CustomInput>
                    <CustomInput type={"date"} value ={userData.birthday_date} name={"birthday_date"} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
                
                    <Button className="w-auto" variant="primary" type="submit">
                            Registrarme
                        </Button>
                </Form>
            </div>
        </Container>
    )
}

export default Register;