import axios from 'axios';
//const baseUrl = 'http://localhost:8080'
const baseUrl = 'http://spring21-sps-18.appspot.com'
export default axios.create({
	baseURL: baseUrl
})
