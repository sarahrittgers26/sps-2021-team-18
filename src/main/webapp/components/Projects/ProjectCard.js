import React, {useRef} from 'react'
import './ProjectCard.css'
import AspectRatio from './AspectRatio.js'

function ProjectCard(props) {
  const {title, collaborator} = props;
  const titleRef = useRef();
  const collaboratorRef = useRef();

  return (
  
    <div className="Project_container">
      {AspectRatio(<div className="Project_icon"></div>)}    
      <span className="Project_title" ref={titleRef}>{title}</span>
      <span className="Project_collaborator" ref={collaboratorRef}>{`Collaborator: ${collaborator}`}</span>
       
    </div>
  )
}

export default ProjectCard
