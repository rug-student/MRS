import React from 'react';
import '../styleSheets/InsertOptions.css';
import Header from '../components/Header';

function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>Back</button>
  );
}

function InsertOptions({ options, onOptionsChange, onNext, onBack }) {
  const handleAddOption = () => {
    if (options.length < 10) {
      onOptionsChange([...options, '']);
    } else {
      alert('You cannot add more than 10 options.');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  const handleNext = () => {
    const nonEmptyOptions = options.filter(option => option.trim() !== '');
    onOptionsChange(nonEmptyOptions);
    onNext();
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
              <button id="sesto" onClick={handleNext}>Next</button>
            </div>
          </div>
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={"Add a new option"}
                  value={option || ''}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <BackButton onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

export default InsertOptions;
