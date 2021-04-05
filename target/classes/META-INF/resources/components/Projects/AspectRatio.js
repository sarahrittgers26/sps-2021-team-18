import React from 'react';
import "./AspectRatio.css";

function AspectRatio(child) {

  return (
    <div className="AspectRatio">
      <div className="AspectRatio-innerWrapper">{child}</div>
    </div>
  );
}

export default AspectRatio;