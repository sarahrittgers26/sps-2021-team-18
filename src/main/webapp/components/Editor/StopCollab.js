import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import './StopCollab.css';
import './StaticProgressBar.js';
import InfoIcon from '@material-ui/icons/Info';
import StaticProgressBar from './StaticProgressBar.js';

function StopCollab(props) {
  const { collaboratorName, open } = props; 
  return (
    <Dialog open>
      <DialogContent>
        <div className="StopCollab_container"> 
          <div className="dialog_icon">
            <InfoIcon style={{fontSize: 40}}/>
          </div>
          <span className="StopCollab_header">
            Mufaro Makiwa has stopped  editing. Your work is being saved now...
          </span>
          <StaticProgressBar />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StopCollab
