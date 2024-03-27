import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AdminHeader } from "../../components/AdminHeader/AdminHeader"
import { Header } from "../../components/Header/Header"
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute"
import { CreatePlan } from "../Dietplans/CreatePlan"
import { Home } from "../Home/Home"
import Login from "../Login/Login"
import { Profile } from "../Profile/Profile"
import Register from "../Register/Register"
import { Appointments } from "../User/Appointments"
import { Dashboard } from "../User/Dashboard"
import { DietitiansAppointments } from "../User/DietitiansAppointments"
import { ListAllAppointments } from "../User/ListAllAppointments"
import { ListAllClients } from "../User/ListAllClients"
import { ListAllUsers } from "../User/ListAllUsers"
import { ListDietPlans } from './../Dietplans/ListDietPlans'

export const Body = () => {

    const [isAdminRoute, setIsAdminRoute] = useState(false);

    useEffect(() => {
        setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    })

    return (
        <>
            {/*Se carga la cabecera dependiendo de si navegas por el Admin o por el sitio web */}
            {isAdminRoute ? (
                <>
                    <AdminHeader /> 
                </>
            )
            : <Header />}

            <Routes>
                <Route path="*" element={<Navigate to="/" />} />                                
                
                {/* Admin routes */}
                <Route path="/admin">
                    <Route path="*" element={<Navigate to="dashboard" />} />

                    {/* Private routes */}
                    <Route path="dashboard" element={<PrivateRoute Component={Dashboard} />} />
                    <Route path="users" element={<PrivateRoute Component={ListAllUsers} />} />
                    <Route path="clients" element={<PrivateRoute Component={ListAllClients} />} />
                    <Route path="dietplans/create/:clientId" element={<PrivateRoute Component={CreatePlan} />} />
                    <Route path="dietplans/update/:clientId/:planId" element={<PrivateRoute Component={CreatePlan} />} />
                    <Route path="dietplans/:clientId" element={<PrivateRoute Component={ListDietPlans} />} />
                    <Route path="appointments" element={<PrivateRoute Component={ListAllAppointments} />} />
                </Route>

                {/* Website routes */}
                <Route path="/">
                    <Route path="*" element={<Navigate to="/" />} />
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login /> } />                
                    <Route path="register" element={<Register /> } />

                    {/* Private routes */}
                    <Route path="profile" element={<PrivateRoute Component={Profile} />} />
                    <Route path="dietplans/:clientId" element={<PrivateRoute Component={ListDietPlans} />} />
                    <Route path="myAppointments" element={<PrivateRoute Component={Appointments} />} />
                    <Route path="dietitianAppointments" element={<PrivateRoute Component={DietitiansAppointments} />} />
                </Route>
            </Routes>
        </>
    )
}