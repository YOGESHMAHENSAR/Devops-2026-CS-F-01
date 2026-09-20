import { Navigate } from "react-router-dom";

export default function Protected({user, roles, children}) {
  if(!user){
    return <Navigate to="/login" replace></Navigate>;
  }
  if(roles && !roles.includes(user.role)){
    return <Navigate to='/' replace></Navigate>
  }
  return children;
}
