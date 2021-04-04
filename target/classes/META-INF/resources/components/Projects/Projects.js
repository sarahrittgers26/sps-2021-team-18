import React, {useEffect, useState} from 'react'
import './Projects.css'
import ConnectedUsers from './ConnectedUsers.js'
import Searchbar from './Searchbar.js'


const active = [
  {name: "Mufaro Emmanuel Manue Makiwa", id: 0},
  {name: "Cynthia Enofe", id: 1},
  {name: "Michael Lawes", id: 2},
  {name: "Sarah Rittgers", id: 3},
]

const inactive = [
  {name: "Emmanuel Makiwa", id: 0},
  {name: "Andreea Lovan", id: 1}
]

function Projects() {

  const [searchQuery, setSearchQuery] = useState("");
  const onActiveUserClick = (id) => {
    console.log("Active user clicked: " + id);
  }
  
  
  const onInactiveUserClick = (id) => {
    console.log("Inactive user clicked: " + id);
  }

  useEffect(() => {

  });


  return (
    <div className="Projects_container">

      <div className="Projects_content">
        <Searchbar
          query={searchQuery}
          onChange={setSearchQuery}/>
      </div>

      
      <ConnectedUsers 
        active={active}
        inactive={inactive}
        onActiveUserClick={onActiveUserClick}
        onInactiveUserClick={onInactiveUserClick}/>
      
    </div>
  )
}

export default Projects
