import React from 'react';
import { Field, ErrorMessage} from 'formik';
import {InputFormStyles} from '../../styles/InputForm.css';

interface InputFormProps {
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  apply?: React.ReactNode[];
}

const InputForm: React.FC<InputFormProps> = ({
   name, 
   label, 
   placeholder, 
   icon, 
   type, 
   apply
  }) => {
  
    return (
      <div className="flex flex-col mt-12">
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
        </div>
        
        <ErrorMessage 
          name={name} 
          component="div" 
          className={InputFormStyles.error} 
        />

          {apply && (
          <div className="apply-container">
            {apply.map(
              (component,index) => (
                <React.Fragment key={`${name}-apply-${index}`}>
                  {component}
                </React.Fragment>
              ))}
          </div>
        )}
      </div>
    );
};

export default InputForm;