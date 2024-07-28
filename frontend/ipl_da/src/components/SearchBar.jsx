import React, { useState, useEffect } from 'react';
import '../App.css';
function SearchBar({ items, placeholder, onSelect, itemDisplay }) {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items.filter(item => 
      (itemDisplay ? itemDisplay(item) : item).toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, items, itemDisplay]);

  const handleSelect = (item) => {
    onSelect(item);
    setSearch('');
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <ul className="search-list">
          {filteredItems.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}>
              {itemDisplay ? itemDisplay(item) : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;   