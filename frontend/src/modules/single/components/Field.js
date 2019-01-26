import React from 'react';

const Field = ({ 
    editable, 
    label, 
    text, 
    type, 
    onChange, 
    edit, 
    value, 
    inputClassName, 
    pClassName 
}) => (
    <div className="field">
        <label className="is-bold has-mr-05">{label}:</label>
        {
            edit ? (
                <input 
                    className={`input ${inputClassName}`} 
                    value={value} 
                    onChange={onChange} 
                    readOnly={!editable}
                    type={type ? type : 'text'}
                    checked={value}
                />
            ) : (
                <span className={pClassName}>{text ? text : value}</span>
            )
        }
    </div>
)

export default Field;