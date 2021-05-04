import { baseUrl } from '../components/Api/Api';
//const LOCAL = 'ws://localhost:9000/';
const PRODUCTION = 'wss://chat.494901.xyz:9000/';
const LOCAL = 'ws://34.75.137.84:9000/';
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
