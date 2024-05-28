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
            localStorage.setItem('user', data);
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
     * Returns user to a specified page if user is not logged in or not.
     * @param loggedUser true if the user needs to be logged in to be redirected or not.
     * @param page the page to send the user to.
     */
    const checkLoggedIn = (loggedUser, page) => {
        if (isLoggedIn() && loggedUser) {
            navigate(page)
        } else if (!isLoggedIn() && !loggedUser) {
            navigate(page)
        }
    };

    /**
     * Returns if the user is logged in or not
     * @returns logged in status
     */
    const isLoggedIn = () => {
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser) {
            setUser(loggedInUser);
            return true
        } else {
            return false
        }
    }

    /**
     * Logs out the currently logged in user.
     */
    const logout = () => {
        api.post('/logout', [], {withCredentials: true, withXSRFToken: true}).then(() => {
            setUser(null);
            localStorage.clear();
        });
    };

    return <AuthContext.Provider value={{user, errors, login, logout, checkLoggedIn, isLoggedIn}}>
        {children}
    </AuthContext.Provider>
}

export default function useAuthContext() {
    return useContext(AuthContext);
}