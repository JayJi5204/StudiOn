import { useState, useEffect, useRef } from 'react';

export const useMoreMenu = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMoreMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  const toggleMenu = () => setShowMoreMenu(prev => !prev);
  const closeMenu = () => setShowMoreMenu(false);

  return { showMoreMenu, toggleMenu, closeMenu, menuRef };
};