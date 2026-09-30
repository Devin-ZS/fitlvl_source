import { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

export const FONT_SIZES = [
  { key: 'small',  label: 'A',  labelMn: 'А',  scale: 0.9,  navSize: 10, desc: 'Small',  descMn: 'Жижиг' },
  { key: 'medium', label: 'A',  labelMn: 'А',  scale: 1.0,  navSize: 12, desc: 'Default', descMn: 'Стандарт' },
  { key: 'large',  label: 'A',  labelMn: 'А',  scale: 1.15, navSize: 14, desc: 'Large',   descMn: 'Том' },
  { key: 'xlarge', label: 'A',  labelMn: 'А',  scale: 1.3,  navSize: 16, desc: 'X-Large', descMn: 'Их том' },
];

export function FontSizeProvider({ children }) {
  const [sizeKey, setSizeKey] = useState(() => localStorage.getItem('fitlvl-fontsize') || 'medium');

  const current = FONT_SIZES.find(f => f.key === sizeKey) || FONT_SIZES[1];

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', current.scale);
    document.documentElement.style.setProperty('--nav-label-size', `${current.navSize}px`);
    document.documentElement.style.fontSize = `${current.scale * 100}%`;
    localStorage.setItem('fitlvl-fontsize', sizeKey);
  }, [sizeKey, current]);

  const setSize = (key) => setSizeKey(key);

  return (
    <FontSizeContext.Provider value={{ sizeKey, setSize, current, sizes: FONT_SIZES }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
