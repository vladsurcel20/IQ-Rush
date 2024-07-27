import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

interface Props{
    children: ReactNode
}

const ProtectedRoute:React.FC<Props> = ({children}) => {
    const {isLogged} = useAuth()
    
    if(!isLogged){
        return <Navigate to='/' replace></Navigate>
    }
  return (
    <>{children}</>
  )
}

export default ProtectedRoute