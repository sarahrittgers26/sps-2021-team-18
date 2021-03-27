import axios from 'axios';
//const baseUrl = x === 'development' ? 'http://localhost:4000' : process.env.REACT_APP_API_URL;
const baseUrl = 'http://localhost:8080'
export default axios.create({
	baseURL: baseUrl
})
