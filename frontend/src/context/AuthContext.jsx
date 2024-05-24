import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const csrf = () => api.get('/sanctum/csrf-cookie');

    const getUser = async () => {
        try{
            const { data } = await api.get('/api/user', {withCredentials: true, withXSRFToken: true});
            setUser(data);
        } catch(e) {
            console.log(e);
        }
    };

    const login  = async ({ ...data }) => {
        csrf();
        try {
            const response = await api.post('/login', data, {withCredentials: true, withXSRFToken: true});
            await getUser();
            if(response.status === 204) {
                navigate("/dashboard", {replace: true});
            }
        } catch(e) {
            if (e.response.status === 422) {
                setErrors(e.response.data.errors)
            }
        }
    };

    const checkLoggedIn = () => {
        if(!user) {
            navigate('/')
        }
    };

    const logout = () => {
        api.post('/logout', [], {withCredentials: true, withXSRFToken: true}).then(() => {
            setUser(null);
        });
    };

    return <AuthContext.Provider value={{user, errors, getUser, login, logout, checkLoggedIn}}>
        {children}
    </AuthContext.Provider>
}

export default function useAuthContext() {
    return useContext(AuthContext);
}