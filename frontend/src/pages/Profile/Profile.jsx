import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { getUserById, userUpdate } from "../../services/apiCalls";
import { userData } from "../userSlice";
import "./Profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);

  const userRdxData = useSelector(userData)

  const token = userRdxData.credentials.token
  const myId = userRdxData.credentials.userData.userId
  const userRole = userRdxData.credentials.userData.userRole

  useEffect(() => {
    getUserById(token, myId)
    .then((res) => {
        setProfileData(res);
    })
  }, []);

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

  const submitHandler = async (event) => {
    //Handler envío de formulario
    event.preventDefault();
      //Se procede con el login
      userUpdate(token, myId, profileData)
      .then((response) => {
          setMessage(response.message);   
      })
      .catch((err) => {
        setError(err.message);
      });    

  };

  return (
    <div className="profileDesign">
        <div className="miDiv">
            {error ? 
            <Alert variant="warning">
              {message}
            </Alert>
            : null}

          {!error && message ?
            <Alert variant="success">
              {message}
            </Alert>
          : null}
          
            <Form className="text-center shadow p-4 bg-white rounded" onSubmit={submitHandler}>
                <CustomInput type={"text"} required="required" name={"first_name"} value={profileData.first_name} placeholder="Nombre" handler={inputHandler} ></CustomInput>
                <CustomInput type={"text"} required="required" name={"last_name"} value={profileData.last_name} placeholder="apellido" handler={inputHandler} ></CustomInput>
                <CustomInput type={"email"} required="required" name={"email"} value={profileData.email} placeholder="email" handler={inputHandler} ></CustomInput>
                <CustomInput type={"password"} name={"password"} value={profileData.password} placeholder="contraseña" handler={inputHandler} ></CustomInput>
                <CustomInput type={"phone"} required="required" name={"phone"} value={profileData.phone} placeholder="Móvil" handler={inputHandler} ></CustomInput>
                <CustomInput type={"date"} required="required" name={"birthday_date"} value={profileData.birthday_date} placeholder="Fecha de nacimiento" handler={inputHandler} ></CustomInput>
           {/* Sección adicional para usuarios tipo dietista */}
           {userRole == "dietitian" ? (
            <>
              <CustomInput type={"text"} required="required" name={"dietitian.specialization"} value={profileData.dietitian.specialization} placeholder="Especialización" handler={inputHandler} />
            </>
          ) : null}

          {/* Sección adicional para usuarios tipo cliente */}
          {userRole == "client" ? (
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
        </div>
    </div>
  );
};