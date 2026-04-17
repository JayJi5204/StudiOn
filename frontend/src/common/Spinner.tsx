import React from "react";

interface IconProps {
  text: string;
  icon: React.ReactElement; 
}

export const LoadingSpinner = ({ text, icon }: IconProps) => (
  <>
    <div className="w-5 h-5">
      {React.cloneElement(icon as React.ReactElement)}
    </div>
    <span>{text}</span>
  </>
);

export const LoadingComplete = ({ text, icon }: IconProps) => (
  <>
    <div className="w-5 h-5">
      {React.cloneElement(icon as React.ReactElement)}
    </div>
    <span>{text}</span>
  </>
);