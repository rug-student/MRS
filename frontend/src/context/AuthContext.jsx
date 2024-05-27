import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext({});

/**
 * The main provider of authentication logic.
 * @returns Provider containing a set of state variables and auth methods.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const csrf = () => api.get('/sanctum/csrf-cookie');

    /**
     * GETs the currently logged in user, if there is any.
     */
    const getUser = async () => {
        try{
            const { data } = await api.get('/api/user', {withCredentials: true, withXSRFToken: true});
            setUser(data);
        } catch(e) {
            console.log(e);
        }
    };

    /**
     * Tries to login a user with given credentials.
     * @param credentials dictionary of credentials to use for login.
     */
    const login  = async ({ ...data }) => {
        csrf();
        try {
            const response = await api.post('/login', data, {withCredentials: true, withXSRFToken: true});
            await getUser();
            if(response.status === 204) {
                navigate("/dashboard", {replace: true});
                setErrors([]);
            }
            if (response.status === 422) {
                await setErrors(response.data.errors);
            }
        } catch(e) {
            if (e.response.status === 422) {
                setErrors(e.response.data.errors)
            }
        }
    };

    /**
     * Returns user to main page if user is not logged in.
     *
     * KNOWN BUG: when called at the top of a useEffect,
     * on page refresh the user is not loaded yet in the state, so this redirection
     * always happens regardless whether the user is logged in or not.
     */
    const checkLoggedIn = () => {
        if(!user) {
            navigate('/')
        }
    };

    /**
     * Logs out the currently logged in user.
     */
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