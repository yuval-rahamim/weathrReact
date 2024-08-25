import React from 'react';

function MySelect(props) {
  const { selectText, selectId, onChange, options, disabled } = props;

  return (
    <div>
      <h1>{selectText}</h1>
      <select onChange={onChange} id={selectId} disabled={disabled}>
        <option value="" disabled>Pick a {selectText}</option>
        {options.length > 0 ? (
          options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option value="" disabled>No options available</option>
        )}
      </select>
    </div>
  );
}

export default MySelect;
