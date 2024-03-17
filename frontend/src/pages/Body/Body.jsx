import { Navigate, Route, Routes } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute"
import { Home } from "../Home/Home"
import Login from "../Login/Login"
import { Profile } from "../Profile/Profile"
import Register from "../Register/Register"
import { Appointments } from "../User/Appointments"
import { Dashboard } from "../User/Dashboard"
import { DietitiansAppointments } from "../User/DietitiansAppointments"
import { ListAllAppointments } from "../User/ListAllAppointments"
import { ListAllUsers } from "../User/ListAllUsers"

export const Body = () => {

    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login /> } />                
                <Route path="/register" element={<Register /> } />                
                
                {/* Private routes */}
                <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} />} />
                <Route path="/users" element={<PrivateRoute Component={ListAllUsers} />} />
                <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
                <Route path="/myAppointments" element={<PrivateRoute Component={Appointments} />} />
                <Route path="/dietitianAppointments" element={<PrivateRoute Component={DietitiansAppointments} />} />
                <Route path="/appointments" element={<PrivateRoute Component={ListAllAppointments} />} />
            </Routes>
        </>
    )
}