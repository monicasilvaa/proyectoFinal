import { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import { getCentersList, getDietitiansList } from "../../services/apiCalls";

import dietitian03 from '../../images/dietitian.png';
import dietitian01 from '../../images/dietitian01.png';
import dietitian02 from '../../images/dietitian02.png';
import ubicacion from '../../images/ubicacion.jpeg';
import "./Home.css";

export const Home = () => {
  const [dietitiansList, setDietitiansList] = useState(false);
  const [centersList, setCentersList] = useState(false);

  useEffect(() => {
    //Se obtiene la lista de dietistas
    getDietitiansList()
    .then((data) => {
      setDietitiansList(data.results);
    })
    .catch((err) => {
  
    });    

    //Se obtiene la lista de centros
    getCentersList()
    .then((data) => {
      setCentersList(data.results);
    })
    .catch((err) => {
  
    }); 
  }, []);


  return (
    
    <>
      <section id="primera-cita" className="mt-5 text-center">
          <p class="mb-0">Reserva tu primera cita</p>
      </section>
      <section id="home" className="home-wrap">

        <div className="home-bg-img" >

            <div className="container home-content">

                <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <h1 class="title-home">Alimentación saludable.</h1>
                        <p class="text-home">Las dietistas nutricionistas poseen un conocimiento único y especializado. No solo ayudan a mejorar la alimentación, sino también la salud y el bienestar..</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="gallery" className="gallery-wrap" style={{background: "#F9F9F9",}}>

        <div className="container">

            <div  id="dietistas" className="sec-title">
                <h1>Nuestros dietistas-nutricionistas</h1>
                <div className="row">             
                  <img src={dietitian01} className="my-2 col-sm-4" />
                  <img src={dietitian02} className="my-2 col-sm-4"/>
                  <img src={dietitian03} className="my-2 col-sm-4"/>
                </div>
            </div>

            <div id="centros" className="sec-title pt-4">
                <h1>Nuestros centros</h1>
                <div className="row">
                {centersList ? (
                  centersList.map(function(data) {
                    return (
                      <Card key={data.id} className="col-xl-3 col-lg-6 col-md-6 mb-5">
                        <Card.Img variant="top" src={ubicacion} />
                        <Card.Body>
                          <Card.Title>{data.address}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{data.phone}</Card.Subtitle>
                        </Card.Body>
                      </Card>
                    )
                  })
                ) : ""}
                </div>
            </div>

        </div>

        <div className="container-fluid">

            <div className="row">

            </div>
        </div>

      </section>
    </>
  );
};
