import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import './Pane.css';
import MinimizeIcon from '@material-ui/icons/Minimize';
import { Controlled as ControlledEditor } from 'react-codemirror2';

function Pane(props) {
  const {language, displayName, value, onChange} = props;
  const handleChange = (editor, data, value) => {
    onChange(value);
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
