import baseUrl from '../components/Api/Api';

const AppConfig = {
  PROTOCOL: "ws://",
  HOST: 'localhost',
//  HOST: "https://spring21-sps-18.appspot.com",
  PORT: ":9000/"
}

const SocketSingleton = (() => {
  let instance;

  const createInstance = () => {
    return new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);
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
