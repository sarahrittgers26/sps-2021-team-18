import React from 'react'
import { Dialog, DialogContent } from '@material-ui/core';
import './About.css'

const About = (props) => {
  const {isOpen, closeDialog} = props;
  return (
    <Dialog open={isOpen}>
    <DialogContent>
      <div className="About_container">
        <div className="fixed">
          <span className="About_header">
            About
          </span>
        </div>
        <div className="About_content">
          <span className="About_message">
            COLLABCODE is a platform that allows users to learn the basics of web development
            collaboratively. Any two online users can connect by creating a collaborative project to live code 
            basic HTML, CSS and Javascript code while getting immediate feedback. 
          </span>

          <span className="About_message below">
            To use CODECOLLAB, you have to select any user who is online to send a request to
            create a new project. Once the project has been created, you can then send an invitation
            to your partner to start collaborating on the new project by clicking continue on the project tile.
          </span>

          <span className="About_message below">
            To encourage collaboration amongst students, you can only work on a project while
            you and your partner are both online and editing together. However, you also have an option to download the 
            project files and continue working offline.
          </span>

          <span className="About_message below">
            If you do not want to receive invitations to collaborate from other users while using the application, you can hide your 
            online status by updating your profile settings. However, while your online status is hidden, you will not be able to
            collaborate with other users or to see other online users.
          </span>
        </div>

        <div className="About_button_container">
            <button className="About_button" onClick={closeDialog}>CLOSE</button>
          </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default About;
