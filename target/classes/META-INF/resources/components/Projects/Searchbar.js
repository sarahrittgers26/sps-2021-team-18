import React from 'react'
import './Searchbar.css'
import SearchIcon from '@material-ui/icons/Search';

function Searchbar(props) {
  const {query, onChange} = props;

  const handleChange = elt => {
    onChange(elt.target.value);
  }

  return (
    <div className="Searchbar_container">

      <div className="Searchbar_icon_container">
        <SearchIcon className="Searchbar_icon"/>
      </div>
      
      <input 
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a project"
        className="Searchbar_input"/>
    </div>
  )
}

export default Searchbar
