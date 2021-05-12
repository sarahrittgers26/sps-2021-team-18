import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pane from './Pane.js';
import Navbar from './Navbar.js';
import './Editor.css';
import './StopCollab.js';
import html2canvas from 'html2canvas';
import FormData from 'form-data'
import { handleSave, clearProject, updateEdit } from '../../actions';
import SocketSingleton from '../../middleware/socketMiddleware';
import StopCollab from './StopCollab.js';
import { ACTION } from '../../actions/types';

const Editor = ({ history }) => {
  const dispatch = useDispatch();
  const { html, css, js, title, activeProject, collaboratorId, 
	  collaboratorName, collaboratorAvatar, onlineProjects, offlineProjects } = 
		useSelector((state) => state.projectReducer);
  const user = useSelector((state) => state.userReducer);
  const [projecthtml, setProjectHtml] = useState(html);
  const [projectcss, setProjectCss] = useState(css);
  const [projectjs, setProjectJs] = useState(js);
  const [curProject, setCurProject] = useState(activeProject);
  const [srcDoc, setSrcDoc] = useState("");
  const [projectName, setProjectName] = useState(title);
  const [displayExit, setDisplayExit] = useState(false);
  const [sock, setCurSock] = useState(SocketSingleton.getInstance());

  sock.onmessage = (response) => {
    let message = JSON.parse(response.data);
    switch (message.type) {
      case ACTION.SEND_HTML:
        setProjectHtml(message.data);
        break;
      case ACTION.SEND_CSS:
        setProjectCss(message.data);
        break;
      case ACTION.SEND_JS:
        setProjectJs(message.data);
        break;
      case ACTION.SEND_TITLE:
        setProjectName(message.data);
        break;
      case ACTION.SEND_LEFT:
        save();
        setDisplayExit(true);
        setTimeout(() => {
          dispatch(updateEdit(false));
          dispatch(clearProject());
          history.push('/projects');
        }, 3000);
        break;
      default:
    }
  }

  const save = () => {
    html2canvas(document.querySelector("#render_pane")).then(canvas => {
      canvas.toBlob((blob) => {
        let formData = new FormData();
        formData.append("image", blob);
        dispatch(handleSave({
          html: projecthtml,
          css: projectcss,
          js: projectjs,
          projectid: curProject,
          title: projectName,
          image: formData,
        }));
      });
    })
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

  window.onbeforeunload = () => {
    sock.onclose = () => {}
  }

  sock.onclose = () => {
    let sock = SocketSingleton.nullifyInstance();
    sock.onopen = () => {
      let msg = JSON.stringify({
          id: user.username,
          type: ACTION.SIGN_IN,
          data: ""
      });
      sock.send(msg);
      let allProjectsReloaded = onlineProjects.concat(offlineProjects);
      let allPaneIDS = []
      allProjectsReloaded.forEach((project) => {
          // Setup socket for each editor pane with specified project 
          let projectid = project.projectid;
          allPaneIDS.push(projectid);
      });
      allPaneIDS.forEach(paneID => {
          let msg = JSON.stringify({
              id: paneID,
              type: ACTION.LOAD_INIT_PROJECTS,
              data: ""
          })
          sock.send(msg);
      });
    }
    setCurSock(sock);
  }

  return (
    <div className="Editor_container">
      <Navbar
        history={history}
        projectName={projectName}
        socket={sock}
        title={title}
        collaborator={collaboratorId}
        collaboratorName={collaboratorName}
        collaboratorAvatar={collaboratorAvatar}
        projectid={activeProject}
        handleSave={save}/>

      <div className="Editor_pane Editor_top_pane" id="render_pane">
        <Pane 
         language="xml"
         displayName="HTML"
         value={projecthtml}
         socket={sock}
         projectid={activeProject}/>

        <Pane 
         language="css"
         displayName="CSS"
         value={projectcss}
         socket={sock}
         projectid={activeProject}/>

        <Pane 
         language="javascript"
         displayName="JS"
         value={projectjs}
	       socket={sock}
       	 projectid={activeProject}/>

      </div>

      <div id="render_pane" className="Editor_pane Editor_bottom_pane">
        <iframe 
          title="output"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin"
          width="100%"
          height="100%"/>
      </div>

      <StopCollab 
        collaboratorName={collaboratorName}
        open={displayExit}/>
    </div>
  );
}

export default Editor;
