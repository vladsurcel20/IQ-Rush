import React from 'react'
import { createContext, useState, useEffect, ReactNode, useContext} from 'react'


interface AuthContext{
    isLogged: boolean,
    login: (token: string) => void;
    logout: () => void;
}

export interface User{
    id: number, 
    username: string,
    password: string,
    registeredAt: string,
    points: number, 
    quizzesDone: number
}


export const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLogged, setIsLogged] = useState<boolean>(false);

  
    useEffect(() => {
      const token = sessionStorage.getItem('jwt');
      if (token) {
        setIsLogged(true);
      }
    }, []);
  
    const login = (token: string) => {
      sessionStorage.setItem('jwt', token);
      setIsLogged(true);
    };
  
    const logout = () => {
      sessionStorage.removeItem('jwt');
      setIsLogged(false);
      sessionStorage.removeItem('user')
    };
  
  
    return (
      <AuthContext.Provider value={{isLogged, login, logout}}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContext => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

