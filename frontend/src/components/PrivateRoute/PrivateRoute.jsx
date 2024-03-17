import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loggedIn } from "../../pages/userSlice";

const PrivateRoute = ({ Component }) => {
 
const isAuthenticated = useSelector(loggedIn);

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};
export default PrivateRoute;