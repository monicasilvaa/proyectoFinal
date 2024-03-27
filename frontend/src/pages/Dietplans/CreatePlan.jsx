import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { dietPlanCreate, getClientById, getDietplanById, getFoods, getMeals, getUserById } from "../../services/apiCalls";
import { userData } from "../userSlice";
import "./CreatePlan.css";

export const CreatePlan = () => {
  const { clientId, planId } = useParams();
  const [dietitianId, setDietitianId] = useState(false);
  const [mealId, setMealId] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [mealsData, setMealsData] = useState({});
  const [mealsListData, setMealsListData] = useState([]);
  const [clientData, setClientData] = useState({});
  const [planDetailData, setPlanDetailData] = useState([]);
  const [planData, setPlanData] = useState({});
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const [errorSelect, setSelectError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilteredResults, setSearchFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dietPlanSummary, setDietPlanSummary] = useState([]);

  const userRdxData = useSelector(userData)

  const token = userRdxData.credentials.token
  const myId = userRdxData.credentials.userData.userId
  const userRole = userRdxData.credentials.userData.userRole

  useEffect(() => {

    if(typeof planId !== "undefined") {
      getDietplanById(token,planId)
      .then((res) => {
        setPlanData(res);

        res.planDetails?.map((detail) => {
          if(typeof mealsListData[detail.meal.id] == "undefined"){
            mealsListData[detail.meal.id] = [];
          }
          
          let found = mealsListData[detail.meal.id].find((el) => el.name == detail.food.name);

          if(!found){
            setMealsListData(prevState => ({
              ...prevState,
              [detail.meal.id]: [detail.food, ...prevState[detail.meal.id]]
            }));
          }

        });


      });
    }

    getUserById(token,myId)
    .then((res) => {
        setDietitianId(res?.dietitian?.id);
    })

    getFoods(token)
    .then((res) => {
      setSearchResults(res.results);
      setLoading(false);
      })
 
    getClientById(token, clientId)
    .then((res) => {
      setClientData(res);
      }) 

      getMeals(token)
      .then((res) => {
        setMealsData(res.results);
      }) 

      setPlanData(prevState => ({
          ...prevState,
          client: clientId,
          dietitian: dietitianId
      }));


  }, [mealsListData]);

  const selectHandler = (event) => {
      const value = event.target.value;
      setMealId(value);
  }

  const addFood = (food) => {
    setError(false);
    setSelectError(false);

    if(typeof mealsListData[mealId] == "undefined") {
      mealsListData[mealId] = [];
    }   

    let found = mealsListData[mealId]?.find((it) => it.id == food.id);

    if (found) {
      setSelectError('El alimento seleccionado ya ha sido añadido para esta toma.');
      return false;
    }     

    if(quantity > 0) {
      food.quantity = quantity;
    
      planDetailData.push({meal: mealId, food: food.id, quantity: food.quantity});
      
      setPlanData(prevState => ({
        ...prevState,
        planDetails: planDetailData
      }));
    
      setMealsListData(prevState => ({
        ...prevState,
        [mealId]: [food, ...prevState[mealId]]
      }));

      let newsAttributes = [];

      for (const attribute of food.foodAttributes) {
        let found = dietPlanSummary.find((attr) => attr.name == attribute.name);

        if(typeof found == "undefined") {

          // Se añade un nuevo attributo
          const newAttribute = {
            name: attribute.name,
            value: food.quantity / 100 * parseFloat(attribute.value,2) + parseFloat(found?.value || 0,2)
          }

          newsAttributes.push(newAttribute);
        }
        else {
          //se actualiza el attributo existente
          found.value += parseInt(attribute.value);

        }

        setDietPlanSummary([...dietPlanSummary, ...newsAttributes])

      }

    } else {
      setError("Debe especificarse el campo Cantidad");
    }
  }

  const removeFood = (meal, food) => {
    setMealsListData((prevState) => ({
      ...prevState,
      [meal]: mealsListData[meal].filter(i => i.id !== food.id)
    }));
    
    let newsAttributes = [];

    for(let meals of mealsListData) {
      for(let toma of meals) {
        for (const attribute of toma.foodAttributes) {
          let found = dietPlanSummary.find((attr) => attr.name == attribute.name);
  
          if(typeof found == "undefined") {
  
            // Se añade un nuevo attributo
            const newAttribute = {
              name: attribute.name,
              value: food.quantity / 100 * parseFloat(attribute.value,2) + parseFloat(found?.value || 0,2)
            }
  
            newsAttributes.push(newAttribute);
          }
          else {
            //se actualiza el attributo existente
            found.value += parseFloat(attribute.value, 2);
  
          }  
        }
      };
    }
    setDietPlanSummary(newsAttributes);
  }

  const quantityHandler = (event) => {
    setQuantity(event.target.value);  
  }
  const inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    setPlanData((prevState) => {
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

  const handleSearch = (e) => {
    const query = e.target.value;

    if(!showResults) {
      setShowResults(true);
    }

    setSearchQuery(query);
    const filteredResults = searchResults.filter((result) =>
      result.name.includes(query)
    );
    setSearchFilteredResults(filteredResults);
  };

  const submitHandler = async (event) => {
    setError(false);
    setMessage(false);
    //Handler envío de formulario
    event.preventDefault();

    if (typeof planData['goal'] == "undefined") {
      setError('El campo objetivo es obligatorio');
      return false;
    }

    dietPlanCreate(token, planData)
      .then((response) => {
          setMessage(response.message);   
      })
      .catch((err) => {
        setError(err.message);
      });
     
  };

  return (
    <Container className="mt-5 pt-5">
      <div className="profileDesign bg-white p-4">
          <div className="miDiv col-12">
            <h2 className="mt-4 mb-4">Plan para {clientData?.user?.first_name} {clientData?.user?.last_name}</h2>
            <hr/>

            {error ? 
              <Alert className="m-2" variant="warning">
                {error}
              </Alert>
              : null}

            {!error && message ?
              <Alert className="m-2" variant="success">
                {message}
              </Alert>
            : null}

              <Form className="shadow p-4 my-3 bg-white rounded" onSubmit={submitHandler}>
                <h4>Información del plan</h4>
                  <CustomInput type={"text"} required="required" name={"goal"} value={planData?.goal} placeholder="Objetivo" handler={inputHandler} ></CustomInput>
                <div className="row">
                  {dietPlanSummary.length > 0 ? 
                    dietPlanSummary.map((data) => {
                        return (
                          <div className="col col-sm-2 box-attrib p-0 mx-2">
                              <p className="box-title" key={data.name}>{data.name}</p>
                              <p className="text-center">{data.value}</p>
                          </div>
                        )
                    })
                    : null
                  }
                </div>
              </Form>

              <Form className="shadow p-4 bg-white rounded mb-5">
                <h4>Tomas del plan</h4>
                <Row>
                  <Col>
                    <CustomInput type={"text"} className="col" required="required" name={"quantity"} placeholder="Cantidad en gramos" handler={quantityHandler} ></CustomInput>
                  </Col>
                  <Col>
                    <Form.Select className="w-auto mx-auto px-5" aria-label="Meal" value={mealId} onChange={selectHandler}>
                      <option>Meal</option>
                      {mealsData.length > 0 ? 
                        mealsData.map(function(data) {
                            return (
                              <option key={data.id} value={data.id}>{data.name}</option>
                            )
                        })
                        : "Sin tomas"
                      }
                    </Form.Select>
                  </Col>
                  <Col>
                    <div className="search-group">
                      {/* Search input */}
                      <input className="col"
                            type="text"
                            placeholder="Buscar alimento..."
                            value={searchQuery}
                            onChange={handleSearch}
                            onBlur={() =>{setShowResults(false)}}
                          />
                          {/* Display search results */}
                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                              showResults ? (
                                  <ul className="results-lists p-3 w-100 shadow">
                                  {searchFilteredResults.map((result) => (
                                    <li className="d-flex my-2 pe-4" key={result.id} onMouseDown={() => addFood(result)}>{result.name} {!planId ? <i className="fa-solid fa-plus text-success me-0 ms-auto" ></i> : null}</li>
                                  ))}
                                </ul>
                              )
                              : null

                          )}
                          {/* Display error */}
                          {errorSelect && <Alert variant="warning">{errorSelect}</Alert>}
                      </div>
                    </Col>
                  </Row>    
              </Form>

              {mealsData.length > 0 ?
                <Row className="bg-white p-4">
                  {mealsData.map(meal => {
                      return (
                          <Col className="col-12 col-sm-3" >
                            <h5 className="my-2 border-bottom pb-2" key={meal.id}>{meal.name}</h5>
                            {
                                mealsListData[meal.id]?.map(food => {
                                    return (
                                        <p className="d-flex my-1" key={food.id} onClick={() => {removeFood(meal.id, food)}}>{food.name} <span className="me-0 ms-auto">{food.quantity} gr</span>{!planId? <i className="fa-solid fa-minus text-danger me-0 ms-auto" ></i> :null}</p>
                                    );
                                }) 
                            }
                          </Col>
                      );
                  })}
                </Row>
            : null }              
          </div>
          <div className="col-12 btn-actions d-flex justify-content-end">
            {!planId ?
              <Button className="w-auto ms-auto me-0" variant="dark" type="submit" onClick={submitHandler}>
                  Guardar
              </Button>
            :null  
          }
           
          </div>
      </div>
    </Container>
  );
};