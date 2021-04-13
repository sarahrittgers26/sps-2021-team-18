import React from 'react';
import "./AspectRatio.css";

const AspectRatio = (child) => {

  return (
    <div className="AspectRatio">
      <div className="AspectRatio-innerWrapper">{child}</div>
    </div>
  );
}

export default AspectRatio;
