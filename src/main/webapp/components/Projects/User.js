import React, { useEffect, useRef } from 'react';
import './User.css';
import Icon_1 from "../../images/avatar-1.png";
import Icon_2 from "../../images/avatar-2.png";
import Icon_3 from "../../images/avatar-3.png";
import Icon_4 from "../../images/avatar-4.png";
import Icon_5 from "../../images/avatar-5.png";
import Icon_6 from "../../images/avatar-6.png";
import Icon_7 from "../../images/avatar-7.png";
import Icon_8 from "../../images/avatar-8.png";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const User = (props) => {
  const { name, isActive, onClick, avatar } = props;
  const nameRef = useRef();

  const isOverflowing = (elt) => {
    return elt.offsetWidth < elt.scrollWidth;
  }

  // add scroll effect when text overflows
  useEffect(() => {
    if (isOverflowing(nameRef.current)) {
      nameRef.current.classList.add("marquee");
    }
  });


  const addAvatar = () => {
    switch (avatar) {
      case "1":
        return Icon_1;

      case "2":
        return Icon_2;

      case "3":
        return Icon_3;

      case "4":
        return Icon_4;

      case "5":
        return Icon_5;

      case "6":
        return Icon_6;

      case "7":
        return Icon_7;

      case "8":
        return Icon_8;
      
      default:
        return;
    }   
  }

  return (
    <div className="User_container" onClick={onClick}>
      <div className="User_image_container">
        <div className="User_image">
          {avatar !== "0" ?
            (<img src={addAvatar()} className="current_icon" alt="Current avatar"/>) : 
            (<AccountCircleIcon style = {{fontSize: 40}} />)}
            <div className="User_activity">
              {isActive ?
              <div className="active"></div> :
              <div className="inactive"></div>}
            </div>
	          
        </div>
      </div>
      <span className="User_name" ref={nameRef}>
        {name}
      </span>
    </div>
  );
}

export default User

