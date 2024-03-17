import { createSlice } from "@reduxjs/toolkit";

export const userDetailSlice = createSlice({
  name: "userDetail",
  initialState: {
    _id: null
  },
  reducers: {
    viewUserDetail: (state, action) => {
        return {
            _id: action.payload
        }
    }
  },
});

export const { viewUserDetail } = userDetailSlice.actions;

// este const es el nombre de la sección del almacén a la que tendré que ir,
// const userRdxDetail = useSelector(userDetailId)
export const userDetailId = (state) => state.userDetail;
export default userDetailSlice.reducer;