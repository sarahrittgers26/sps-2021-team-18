import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pane from './Pane.js';
import Navbar from './Navbar.js';
import './Editor.css';
import { handleSave } from '../../actions';
import SocketSingleton from '../../middleware/socketMiddleware';
import { ACTION } from '../../actions/types.js';
import { updateCanEdit } from '../../actions';
const Editor = ({ history }) => {
  const dispatch = useDispatch();
  const { html, css, js, title, activeProject, collaboratorId, 
	  collaboratorName, collaboratorAvatar } = 
		useSelector((state) => state.projectReducer);
  
  // I don't think we can use the "projecthtml" useState variables
  // For the sockets we need a way to update text changes within the text editors themselves
  // when the user types, but also store those changes to the "html", "css", "js" variables
  // in the React Store for database saving. We also have to figure out a way to send updates
  // to each editor through sockets and have them update on the collaborator's end
  // We can either add a JQuery function to each editor component that has the socket actions
  // embded into the function and directly sending changes with stuff like OnKeyPress for each
  // editor component. Or we can disregard storing into in the react store entirely and just
  // send the current projecthtml, projectcss, projectjs to the backend whenever the user clicks
  // save
  const [projecthtml, setProjectHtml] = useState(html);
  const [projectcss, setProjectCss] = useState(css);
  const [projectjs, setProjectJs] = useState(js);
  const [srcDoc, setSrcDoc] = useState("");
  const [projectName, setProjectName] = useState(title);
  const socket = SocketSingleton.getInstance();
  
  socket.onmessage = (response) => {
    let message = JSON.parse(response.data);
    switch (message.type) {
      case ACTION.SEND_HTML:
	setProjectHtml(message.data)
	break;
      case ACTION.SEND_CSS:
	setProjectCss(message.data)
	break;
      case ACTION.SEND_JS:
	setProjectJs(message.data)
	break;
      case ACTION.SEND_TITLE:
	setProjectName(message.data);
	break;
      case ACTION.SEND_LEFT:
        alert(`${message.data} left`)
        console.log(message.data /*collaboratorName*/);
        console.log(message.id /*collaborator username*/);
        // Call function to render everything below the navbar greyed out/untouchable
        // Can also leave a prompt instructing the user to save or leave
	dispatch(updateCanEdit(false));
	history.push('/projects');
        break;
      default:
    }
  }

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${projecthtml}</body>
        <style>${projectcss}</style>
        <script>${projectjs}</script>
      </html>
      `)
    }, 250);

    return () => clearTimeout(timeout);
  }, [projecthtml, projectcss, projectjs]);

  return (
    <>
      <Navbar
        history={history}
        projectName={projectName}
        socket={socket}
        title={title}
	collaborator={collaboratorId}
	collaboratorName={collaboratorName}
	collaboratorAvatar={collaboratorAvatar}
        projectid={activeProject}
        handleSave={() => dispatch(handleSave({ html: projecthtml, css: projectcss,
		    js: projectjs, projectid: activeProject, title: projectName }))}/>

      <div className="Editor_pane Editor_top_pane">
        <Pane 
         language="xml"
         displayName="HTML"
         value={projecthtml}
         socket={socket}
         projectid={activeProject}/>

        <Pane 
         language="css"
         displayName="CSS"
         value={projectcss}
	 socket={socket}
	 projectid={activeProject}/>

        <Pane 
         language="javascript"
         displayName="JS"
         value={projectjs}
	 socket={socket}
	 projectid={activeProject}/>

      </div>

      <div className="Editor_pane Editor_bottom_pane">
        <iframe 
          title="output"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin"
          width="100%"
          height="100%"/>

      </div>
    </>
  );
}

export default Editor;
