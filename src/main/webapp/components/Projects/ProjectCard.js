import React from 'react';
import './ProjectCard.css';
import AspectRatio from './AspectRatio.js';
import GetAppIcon from '@material-ui/icons/GetApp';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const ProjectCard = (props) => {
  const { title, collaboratorName, downloadProject, continueProject, image } = props;

  return (
    <div className="Project_container card">
      {AspectRatio(
        <div className="Project_icon">
          <img src={image} alt="Project Icon" className="Project_image"/>
        </div>
      )}    
      <span className="Project_title">
        {title}
      </span>
      <span className="Project_collaborator">
        {`Collaborator: ${collaboratorName}`}
      </span>

      <div className="Project_options">
        <button className="download" onClick={downloadProject}>
          <GetAppIcon />
          <span className="button_text">
            Download
          </span>
        </button>

        <button className="continue" onClick={continueProject}>
          <PlayArrowIcon />
          <span className="button_text">
            Continue
          </span>
        </button>
      </div>
       
    </div>
  );
}

export default ProjectCard
