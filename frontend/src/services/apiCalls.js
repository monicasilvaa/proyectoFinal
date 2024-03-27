import axios from "axios";
import { API_BASE_URL } from "../constants/constants";

axios.defaults.baseURL = ""

// Configurar un interceptor de respuesta para todas las solicitudes
axios.interceptors.response.use(
    response => response, // Pasar la respuesta sin cambios si es exitosa
    error => {
      if (error.response && error.response.status === 401) {
        // Redirigir a la página de login en caso de respuesta 401
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

export const deleteUser = async (token, id) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.delete(`${API_BASE_URL}/api/users/${id}`, config)

    return res.data;
}

export const userLogin = async (credentials) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
    return res.data.token
}

export const registerClient = async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    return res.data
}

export const userCreate = async (token, userData) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.post(`${API_BASE_URL}/api/users`, userData, config)
    return res.data
}

export const userUpdate = async (token, id, userData) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.patch(`${API_BASE_URL}/api/users/profile/${id}`, userData, config)
    return res.data
}

export const appointmentUpdate = async (token, id, appointmentData) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.patch(`${API_BASE_URL}/api/appointments/${id}`, appointmentData, config)
    return res.data
}

export const getUserById = async (token, id) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/profile/${id}`, config)
    return res.data
}

export const getClientById = async (token, id) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/client/${id}`, config)
    return res.data
}

export const getMeals = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/dietplans/meals`, config)
    return res.data
}

export const getUsers = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users`, config)
    return res.data
}

export const getFoods = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/foods`, config)
    return res.data
}

export const getAvailableRoles = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/roles`, config)
    return res.data
}

export const getClientsList = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/registeredClients`, config)
    return res.data
}

export const appointmentCreate = async (token, appointmentData) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.post(`${API_BASE_URL}/api/appointments`, appointmentData, config)
    return res.data
}

export const deleteAppointment = async (token, id) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, config)

    return res.data;
}

export const getAppointmentsByClient = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/myAppointments`, config)
    return res.data
}

export const dietPlanCreate = async (token, dietplanData) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.post(`${API_BASE_URL}/api/dietplans`, dietplanData, config)
    return res.data
}

export const getDietplans = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/dietplans`, config)
    return res.data
}

export const getDietplanById = async (token, id) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/dietplans/${id}`, config)
    return res.data
}

export const getDietplansByClient = async (token, id) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/dietplans/client/${id}`, config)
    return res.data
}

export const getAppointments = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/appointments`, config)
    return res.data
}

export const getAppointmentsByDietitian = async (token) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/users/dietitianAppointments`, config)
    return res.data
}



export const getAppointmentById = async (token, id) => {
    const config = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    const res = await axios.get(`${API_BASE_URL}/api/appointments/${id}`, config)
    return res.data
}

export const getDietitiansList = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/users/dietitians`)
    return res.data
}

export const getCentersList = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/centers`)
    return res.data
}

export const getServicesList = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/services`)
    return res.data
}

export const getDietitiansByCenterId = async (centerId) => {
    const res = await axios.get(`${API_BASE_URL}/api/users/dietitians/${centerId}`)
    return res.data
}