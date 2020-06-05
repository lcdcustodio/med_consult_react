import axios from "axios";

axios.defaults.baseURL = 'https://appmedconsultor.rededor.com.br/medico-consultor-api';
//axios.defaults.baseURL = 'http://appmedconsultor-hmg.rededor.com.br/medico-consultor-api';
//axios.defaults.baseURL = 'http://192.168.1.7:8080/medico-consultor-api';

export default axios;