import React, { useEffect, useRef } from 'react';
import './User.css';

const User = (props) => {

  const { name, isActive, onClick } = props;
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

  return (
    <div className="User_container" onClick={onClick}>
      <div className="User_image_container">
        <div className="User_image">
	  {isActive ?
          <div className="User_activity active"></div> :
          <div className="User_activity inactive"></div>
	  }
        </div>
      </div>
      <span className="User_name" ref={nameRef}>
        {name}
      </span>
    </div>
  );
}

export default User

