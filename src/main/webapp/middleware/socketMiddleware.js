const AppConfig = {
  PROTOCOL: window.location.protocol === 'https:' ? 'wss://' : 'ws://',
  HOST: 'localhost',
  // HOST: "spring21-sps-18.appspot.com",
  PORT: ":9000/"
}

const SocketSingleton = (() => {
  let instance;

  const createInstance = () => {
    // return new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);
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
