import { baseUrl } from '../components/Api/Api';
//const LOCAL = 'ws://localhost:9000/';
//const PRODUCTION = 'wss://spring21-team-18-bexdlzuwhq-uc.a.run.app:9000/';
//const PRODUCTION = 'wss://spring21-sps-18.appspot.com';
const LOCAL = 'ws://localhost:9000/';
const PRODUCTION = 'wss://spring21-sps-18.appspot.com/';
//http://34.75.137.84/
const AppConfig = {
  SOCKET: baseUrl === 'https://spring21-sps-18.appspot.com' ? PRODUCTION : LOCAL,
}

console.log(baseUrl);

const SocketSingleton = (() => {
  let instance;

  const createInstance = () => {
    return new WebSocket(AppConfig.SOCKET);
  }
  
  return {
    getInstance: () => {
      if (!instance) {
	instance = createInstance();
      }
      return instance;
    }
  };
})();

export default SocketSingleton;
