import React from 'react';
import { Field, ErrorMessage} from 'formik';
import {InputFormStyles} from '../../styles/InputForm.css';

interface InputFormProps {
  name: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  rightElement?: React.ReactNode; //우측 버튼이나 아이콘을 위한 추가
}

const InputForm: React.FC<InputFormProps> = ({ name, label, placeholder, icon,rightElement,type = "text" }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={InputFormStyles.label}>
        {label}
      </label>
      
      <div className={InputFormStyles.wrapper}>
        {icon && (
          <div className={InputFormStyles.icon}>
            {React.cloneElement(icon as React.ReactElement)}
          </div>
        )}
        
        <Field name={name}>
          {({ field, meta }: any) => {
            const hasError = !!(meta.touched && meta.error);
            return (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                className={InputFormStyles.input(hasError)}
              />
            );
          }}
        </Field>

        {rightElement && (
          <div className={InputFormStyles.rightElement}>
            {rightElement}
          </div>
        )}
      </div>

      <ErrorMessage 
        name={name} 
        component="div" 
        className={InputFormStyles.error} />
    </div>
  );
};

export default InputForm;