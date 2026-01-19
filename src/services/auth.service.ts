import axios from "axios";

const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN;
const API_URL_SIGNUP = import.meta.env.VITE_REACT_APP_AUTH_API_URL_signin;

export const signup = (username:string,email:string,password:string) => {
    return axios.post(API_URL_SIGNUP, {
        username,
        email,
        password,
    });
};
//
export const signin = (username:string,password:string) => {
    return axios.post(API_URL_SIGNIN, {
        username,
        password
        })
        .then((response) => {
            if (response.data.accessToken) {
                // localStorage.setItem("user", JSON.stringify(response.data));
                sessionStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
    });
};

export const logout = () => {
    // localStorage.removeItem("user");
    sessionStorage.removeItem("user");
}

export const getCurrentUser = () => {
    // const userStr = localStorage.getItem("user");
    const userStr = sessionStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
}