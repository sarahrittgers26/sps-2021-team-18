import React from 'react';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import './Pane.css';
import { ACTION } from '../../actions/types.js';

const Pane = (props) => {
  const { language, displayName, value, onChange, socket, projectid } = props;
  
  socket.onmessage = (response) => {
    let message = JSON.parse(response.data);
    let currentEditor = "SEND_" + displayName;
    if (currentEditor === message.type) {
      onChange(message.data);
    }
  }

  const handleChange = (editor, data, value) => {
    let type = "SEND_" + displayName;
    let msg = JSON.stringify({ id: projectid, type: type, data: value })
    socket.send(msg);
  }

  return (
    <div className="Pane_container">
      <div className="Pane_title">
        {displayName}
        <button className="Pane_minimize_button">
          <MinimizeIcon />
        </button>
      </div>

      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        className="Pane_code_mirror_wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          lineNumbers: true,
          theme: 'material'
        }}
      />
    </div>
  );
}

export default Pane
