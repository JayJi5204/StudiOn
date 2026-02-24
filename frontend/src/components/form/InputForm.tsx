
import React from 'react';
import { Field, ErrorMessage, type FieldProps} from 'formik';
import {InputFormStyles} from '../../styles/InputForm.css';

interface InputFormProps {
  name: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  apply?: React.ReactNode[];
}

const InputForm = ({
   name, 
   label, 
   placeholder, 
   icon, 
   type, 
   apply
  }:InputFormProps) => {
  
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
            {({ field, meta }: FieldProps<string>) => {
              const hasError = !!(meta.touched && meta.error);
              return (
                <input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  className={InputFormStyles.input(hasError)}
                  onKeyDown={(e)=>{e.key === 'Enter'}}
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