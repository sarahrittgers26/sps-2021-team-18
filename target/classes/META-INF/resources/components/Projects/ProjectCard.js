import React from 'react'
import './ProjectCard.css'
import AspectRatio from './AspectRatio.js'
import GetAppIcon from '@material-ui/icons/GetApp';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function ProjectCard(props) {
  const {title, collaborator, downloadProject, continueProject} = props;

  return (
  
    <div className="Project_container">
      {AspectRatio(<div className="Project_icon"></div>)}    
      <span className="Project_title">{title}</span>
      <span className="Project_collaborator">{`Collaborator: ${collaborator}`}</span>

      <div className="Project_options">
        <button className="download" onClick={downloadProject}>
          <GetAppIcon />
          <span className="button_text">Download</span>
        </button>

        <button className="continue" onClick={continueProject}>
          <PlayArrowIcon />
          <span className="button_text">Continue</span>
        </button>
      </div>
       
    </div>
  )
}

export default ProjectCard
