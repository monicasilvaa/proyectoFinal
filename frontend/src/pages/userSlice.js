import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({

    // el nombre del pasillo con el que el store identificará este pasillo, 
    // y la información que contiene ese pasillo nada más abrir
    name: "user",
    initialState: {
        credentials: {},
        vecesLoginLogout: 0,
        isAuthenticated: false
    },

    // los reducers no son más que funciones que reciben el estado actual y la modificación que queremos 
    // hacer sobre él como parámetros (state, action), y devuelve el nuevo estado con la modificación hecha.
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                vecesLoginLogout: state.vecesLoginLogout + 1
            }
        },
        
        logout: (state, action) => {
            return {
                ...state,
                ...action.payload,
                isAuthenticated: false,
                vecesLoginLogout: state.vecesLoginLogout +1
            }
        },

        resetLog: (state, action) => {
            return {
                ...state,
                vecesLoginLogout: 0
            }
        }
    }
})

export const { login, logout } = userSlice.actions;

// este const es el nombre de la sección del almacén a la que tendré que ir,
// const userRdxDetail = useSelector(userDetailId)
export const userData = (state) => state.user;
export const loggedIn = (state) => state.user?.isAuthenticated;
export default userSlice.reducer;