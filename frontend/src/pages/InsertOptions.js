import React from 'react';
import './InsertOptions.css';
import Header from './HeaderLoggedIn.js';

function InsertOptions({ options, onOptionsChange, onNext }) {
  const handleAddOption = () => {
    if (options.length < 10) {
      onOptionsChange([...options, '']);
    } else {
      alert('You cannot add more than 10 options.');
    }
  };

  return (
    <div> 
      <Header />
      <div className="centered-container">
        <div className="form-container">
          <div className="header-buttons">
            <h1 className="subtitle4">Insert Options</h1>
            <div className="buttons">
              <button id="quinto" onClick={handleAddOption}>Add Option</button>
              <button id="sesto" onClick={onNext}>Next</button>
            </div>
          </div>
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={"Add a new option"}
                  value={option || ''}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    onOptionsChange(newOptions);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsertOptions;
