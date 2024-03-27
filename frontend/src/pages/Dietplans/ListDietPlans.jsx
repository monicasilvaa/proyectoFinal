import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getDietplansByClient } from "../../services/apiCalls";
import { userData } from "../userSlice";


export const ListDietPlans = () => {

  const { clientId } = useParams();
  const userRdxData = useSelector(userData)
  const token = userRdxData.credentials.token
  const currentUserId = userRdxData.credentials.userData.userId;
  const userRole = userRdxData.credentials.userData.userRole;
  const [dietplansData, setDietplansData] = useState(false);
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    //Obtener planes
    getDietplansByClient(token, clientId)
    .then((res) => {
        setDietplansData(res.results);
      })    
  }, []);


  return (
    <Container className="mt-5 pt-5">
      {userRole == "dietitian" ? (
          <Row>
            <Col className="d-flex justify-content-end">
            <a className="btn btn-dark my-4" href={"/admin/dietplans/create/" + clientId}>
                Crear plan
            </a>
            </Col>
        </Row>
      ) : null}

      <div className="row">
        <div className="col py-3 mx-2">
          {dietplansData?.length > 0 ? 
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Dietista</th>
                    <th>Objetivo</th>
                    <th>Fecha registro</th>
                  </tr>
                </thead>
                <tbody>
                  {dietplansData?.map(function(data) {
                      return (
                        <tr key={data.id} onClick={() => {navigate("/admin/dietplans/update/" + clientId + "/" + data.id)}}>
                          <td key={data.dietitian?.user?.first_name}>{data.dietitian?.user?.first_name} {data.dietitian?.user?.last_name}</td>
                          <td key={data.goal}>{data.goal}</td>
                          <td key={data.created_at}>{data.created_at}</td>
                        </tr>            
                      )
                  })}
                  </tbody>
                </Table>
            :
            <Container className="pt-5 mt-5">
              <p className="bg-white shadow p-3">Actualmente no existen planes nutricionales para este cliente</p>
            </Container> 
          }
        </div>
      </div>
    </Container>
  )
}