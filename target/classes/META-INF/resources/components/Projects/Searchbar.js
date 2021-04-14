import React, { useEffect, useRef, useState } from 'react';
import './Searchbar.css';
import SearchIcon from '@material-ui/icons/Search';

const Searchbar = (props) => {
  const { query, onChange } = props;
  const searchBarRef = useRef();
  const [focus, setFocus] = useState(false);

  const handleChange = elt => {
    onChange(elt.target.value);
  }

  useEffect(() => {
    focus ? 
      searchBarRef.current.classList.add("Searchbar_container_focused") : 
      searchBarRef.current.classList.remove("Searchbar_container_focused");
  }, [focus]);

  return (
    <div className="Searchbar_container card" ref={searchBarRef}>

      <div className="Searchbar_icon_container">
        <SearchIcon className="Searchbar_icon"/>
      </div>
      
      <input 
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a project"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="Searchbar_input"/>
    </div>
  );
}

export default Searchbar
