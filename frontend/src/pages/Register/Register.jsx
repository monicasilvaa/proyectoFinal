import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { userCreate } from "../../services/apiCalls";



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
        userCreate(userData)
          .then((response) => {
            //Se decodifica el token obtenido en la petición
            console.log(response);
        
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });    
      };

    return (
        <div className="miDiv">
            <Form className="shadow p-4 bg-white rounded" onSubmit={submitHandler}>
                <CustomInput type={"text"} value={userData.username} name={"username"} placeholder="username" handler={inputHandler} ></CustomInput>
                <CustomInput type={"text"} value ={userData.first_name} name={"first_name"} placeholder="Nombre" handler={inputHandler} ></CustomInput>
                <CustomInput type={"text"} value ={userData.last_name} name={"last_name"} placeholder="apellido" handler={inputHandler} ></CustomInput>
                <CustomInput type={"email"} value ={userData.email} name={"email"} placeholder="email" handler={inputHandler} ></CustomInput>
                <CustomInput type={"password"} value ={userData.password} name={"password"} placeholder="contraseña" handler={inputHandler} ></CustomInput>
                <CustomInput type={"phone"} value ={userData.phone} name={"phone"} placeholder="Móvil" handler={inputHandler} ></CustomInput>
                <CustomInput type={"date"} value ={userData.birthday_date} name={"birthday_date"} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
            
                <Button className="w-100" variant="primary" type="submit">
                        Registrarme
                    </Button>
            </Form>
        </div>
    )
}

export default Register;