import axios from 'axios';
// baseUrl only needs to be set to production link when calling appengine:deploy
export const baseUrl = 'http://localhost:8080';
//export const baseUrl = 'https://spring21-sps-18.appspot.com';
export default axios.create({
	baseURL: baseUrl
})
