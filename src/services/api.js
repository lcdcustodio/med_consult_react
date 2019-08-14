import axios from "axios";

axios.defaults.baseURL = 'https://appmedconsultor.rededor.com.br/medico-consultor-api';

axios.interceptors.request.use(function (config) {
	console.log(config);
	return config;
}, function (error) {
	console.log(error);
	return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
	console.log(response);
	return response;
}, function (error) {
	console.log(error);
	return Promise.reject(error);
});

export default axios;