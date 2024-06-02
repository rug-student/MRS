import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});


export const file = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
	withCredentials: true,
	responseType: "blob",
});

export default api;