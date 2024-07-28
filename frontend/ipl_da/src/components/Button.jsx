import React from 'react';

function Button({ onClick, children }) {
  return (
    <button 
      onClick={onClick} 
      style={{
        width: '23%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: '1px solid #007bff',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
    >
      {children}
    </button>
  );
}

export default Button;