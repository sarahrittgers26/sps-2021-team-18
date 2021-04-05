import React, { useEffect, useState } from 'react'
import Pane from './Pane.js'
import Navbar from "./Navbar.js"
import './Editor.css'

function Editor() {

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
      `)
    }, 250)

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <>
      <Navbar
        updateName={setProjectName}/>

      <div className="Editor_pane Editor_top_pane">
        <Pane 
         language="xml"
         displayName="HTML"
         value={html}
         onChange={setHtml}/>

        <Pane 
         language="css"
         displayName="CSS"
         value={css}
         onChange={setCss}/>

        <Pane 
         language="javascript"
         displayName="JS"
         value={js}
         onChange={setJs}/>

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
  )
}

export default Editor
