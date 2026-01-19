import React from 'react';
import { Field } from 'formik';
import {checkboxStyles} from '../../styles/checkboxForm.css';

interface CheckboxFormProps {
  name: string;
  label: string;
}


const CheckboxForm: React.FC<CheckboxFormProps> = ({ name, label }) => {
  return (
    <label className={checkboxStyles.label}>
      <Field
        type="checkbox"
        name={name}
        id={name}
        className={checkboxStyles.input}
      />
      <span className={checkboxStyles.span}>
        {label}
      </span>
    </label>
  );
};

export default CheckboxForm;