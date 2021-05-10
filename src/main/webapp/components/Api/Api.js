import axios from 'axios';
// baseUrl only needs to be set to production link when calling appengine:deploy
 export const baseUrl = 'http://localhost:8080';
//export const baseUrl = 'https://spring21-sps-18-bexdlzuwhq-uc.a.run.app';
export default axios.create({
	baseURL: baseUrl
})
