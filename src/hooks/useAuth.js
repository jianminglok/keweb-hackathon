import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function useAuth() {

    const storedJwt = localStorage.getItem('token');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [jwt, setJwt] = useState(storedJwt || null);

    //set user in context and push them home
    const setUserState = async () => {
        return await axios.get('/api/user').then(res => {
            setUser(res.data.currentUser)
            localStorage.setItem('currentUser', res.data.currentUser);
            localStorage.setItem('firstName', res.data.firstName);
            localStorage.setItem('lastName', res.data.lastName);
            localStorage.setItem('hallName', res.data.hallName);
            navigate('/');
        }).catch((err) => {
            setError(err.response.data);
        })
    }

    //register user
    const registerUser = async (data) => {
        const { first_name, last_name, email, password, hall_name } = data;
        return axios.post(`/api/register`, {
            first_name, last_name, email, password, hall_name
        }).then(async () => {
            await setUserState();
        }).catch((err) => {
            if (err.response.data.msg.includes('WEAK_PASSWORD')) {
                setError("Your password must have at least 6 characters");
            } else if (err.response.data.msg.includes('EMAIL_EXISTS')) {
                setError("You have already registered with this email")
            } else {
                setError(err.response.data.msg);
            }
        })
    };

    //login user
    const loginUser = async (data) => {
        const { email, password } = data;
        return axios.post(`/api/login`, {
            email, password
        }).then(async () => {
            await setUserState();
        }).catch((err) => {
            if (err) {
                if ("response" in err) {
                    if (err.response.data.msg.includes('INVALID_PASSWORD') || err.response.data.msg.includes('EMAIL_NOT_FOUND')) {
                        setError("Your username or password is incorrect");
                    } else {
                        setError(err.response.data.msg);
                    }
                } else {
                    setError(err);
                }
            }
        })
    };

    const forgotPassword = async (data) => {
        const { email } = data;
        return axios.post(`/api/forgotpassword`, {
            email
        }).then(res => {
            setSuccess(res.data.msg)
        }).catch((err) => {
            if (err.response.data.msg.includes('EMAIL_NOT_FOUND')) {
                setError("You have not signed up for an account with this email");
            } else {
                setError(err.response.data.msg);
            }
        })
    };

    return {
        registerUser,
        loginUser,
        forgotPassword,
        error,
        success
    }
}