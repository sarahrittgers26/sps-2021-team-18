import io from 'socket.io-client';
import { ACTION } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return (storeAPI) => {
    let socket = io(baseUrl);
    // eslint-disable-next-line
    let listener;

    // Check actions and emit from socket if needed
    return (next) => (action) => {

      // Send html over socket
      if (action.type === ACTION.SEND_HTML) {
        socket.emit('sent-html', action.payload);
        return;
      }

      // Send css over socket
      if (action.type === ACTION.SEND_CSS) {
        socket.emit('send-css', action.payload);
        return;
      }

      // Send js over socket
      if (action.type === ACTION.SEND_JS) {
        socket.emit('send-js', action.payload);
        return;
      }

      // Pull sign in action and login
      if (action.type === ACTION.SIGN_IN) {
        socket.emit('sign-in', action.payload);
        listener = setupSocketListener(socket, storeAPI);
      }

      if(action.type === ACTION.LOAD_PROJ_INIT) {
	// Get offlineProjects and onlineProjects from data upon signin
	let offlineProjects = action.payload.offlineProjects;
	let onlineProjects = action.payload.onlineProjects;
	
	// Enumerate socket ids for each editor pane for each project
	let offlinePaneIDS = [];
	let onlinePaneIDS = [];

	offlineProjects.forEach((project) => {
          // Setup socket for each editor pane with specified project 
          let projectid = project.projectid;
          offlinePaneIDS.push(`${projectid}-html`);
	  offlinePaneIDS.push(`${projectid}-css`);
	  offlinePaneIDS.push(`${projectid}-js`);
	  offlinePaneIDS.push(`${projectid}-title`);
	});

	onlineProjects.forEach((project) => {
          // Setup socket for each editor pane with specified project 
          let projectid = project.projectid;
          onlinePaneIDS.push(`${projectid}-html`);
	  onlinePaneIDS.push(`${projectid}-css`);
	  onlinePaneIDS.push(`${projectid}-js`);
	  onlinePaneIDS.push(`${projectid}-title`);
	});

        // Subscribe to each server (Creates a connection on socket io)
        offlinePaneIDS.forEach(paneID => {
          socket.emit('subscribe', paneID)
        });

        onlinePaneIDS.forEach(paneID => {
          socket.emit('subscribe', paneID)
        });
      }

      // If user creates a server we need to join that room
      if (action.type === ACTION.CREATE_PROJECT) {
        let projectid = action.payload;
        let paneIDs = [`${projectid}-html`,`${projectid}-css`,
	`${projectid}-js`,`${projectid}-title`];

        // Subscribe to each server (Creates a room on socket io)
        paneIDs.forEach(paneID => {
          socket.emit('subscribe', paneID)
        });
      }
      
      return next(action);
    };
  };
};

// Listens on socket with our username, listens to socket server for specific events
const setupSocketListener = (socket, storeAPI) => {
  return socket.on('update', (action) => {

    // Check for action type
    if (action.type === 'rec-html') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_HTML,
        payload: action.payload
      });
    } else if (action.type === 'rec-css') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_CSS,
        payload: action.payload
      });
    } else if (action.type === 'rec-js') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_JS,
        payload: action.payload
      });
    } else if (action.type === 'rec-title') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_TITLE,
        payload: action.payload
      });
    }
  });
}
