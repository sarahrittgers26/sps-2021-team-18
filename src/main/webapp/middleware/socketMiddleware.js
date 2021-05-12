import { baseUrl } from '../components/Api/Api';
const LOCAL = 'ws://localhost:8080/chat';
const PRODUCTION = 'wss://spring21-sps-18-bexdlzuwhq-uc.a.run.app/chat';
const AppConfig = {
  SOCKET: baseUrl === 'https://spring21-sps-18-bexdlzuwhq-uc.a.run.app' ? PRODUCTION : LOCAL,
}

const SocketSingleton = (() => {
  let instance;

  const createInstance = () => {
    return new WebSocket(AppConfig.SOCKET);
  }
  
  return {
    getInstance: () => {
      if (!instance) {
	      instance = createInstance();  
        instance.onopen = () => {  
        }
        instance.onclose = () => {
          let sock = SocketSingleton.nullifyInstance();
          sock.onopen = () => {
          }
        }
        return;
      } else {
        return instance;
      } 
    },
    nullifyInstance: () => {
      instance = createInstance();
      return instance;
    },
    accessInstance: () => {

    }
  };
})();

export default SocketSingleton;
