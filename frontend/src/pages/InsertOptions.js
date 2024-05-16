import React from 'react';
import './InsertOptions.css'; // Assicurati di importare il file CSS per lo stile
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
        <Header/>
        <div className="centered-container">
          <div className="form-container">
            <h1 className="subtitle">Insert Options</h1>
            {options.map((option, index) => (
              <div key={index}>
                <input id = "inoption"
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
            <button onClick={handleAddOption}>Add Option</button>
            <button id="secondbutton" onClick={onNext}>Next</button>
          </div>
        </div>
      </div>
    );
  }

export default InsertOptions;
