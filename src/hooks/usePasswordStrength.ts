import { useState } from 'react';

export const usePasswordStrength = () => {
  const [strength, setStrength] = useState({
    length: false, uppercase: false, number: false, special: false
  });

  const checkStrength = (password: string) => {
    setStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  const score = Object.values(strength).filter(Boolean).length;
  const color = score <= 2 ? 'bg-red-500' : score <= 4 ? 'bg-yellow-500' : 'bg-green-500';
  const text = score <= 2 ? '약함' : score <= 4 ? '보통' : '강함';

  return { strength, checkStrength, score, color, text };
};