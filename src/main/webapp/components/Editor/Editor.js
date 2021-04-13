import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Pane from './Pane.js'
import Navbar from "./Navbar.js"
import './Editor.css'
import { handleSave } from '../../actions';

const Editor = ({ history }) => {

  const { html, css, js, title, activeProject } = 
		useSelector((state) => state.projectReducer);
  
  const [projecthtml, setProjecthtml] = useState(html);
  const [projectcss, setProjectcss] = useState(css);
  const [projectjs, setProjectjs] = useState(js);
  const [srcDoc, setSrcDoc] = useState("");
  const [projectName, setProjectName] = useState(title);

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
        updateName={setProjectName}
	history={history}
	title={title}
	handleSave={() => handleSave({ html: projecthtml, css: projectcss,
		js: projectjs, projectid: activeProject })}/>

      <div className="Editor_pane Editor_top_pane">
        <Pane 
         language="xml"
         displayName="HTML"
         value={projecthtml}
         onChange={setProjecthtml}/>

        <Pane 
         language="css"
         displayName="CSS"
         value={projectcss}
         onChange={setProjectcss}/>

        <Pane 
         language="javascript"
         displayName="JS"
         value={projectjs}
         onChange={setProjectjs}/>

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

export default Editor
