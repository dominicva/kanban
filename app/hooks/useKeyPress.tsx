import { useState, useEffect } from 'react';

type KeyboardAction = {
  key?: string;
};

const useKeyPress = (targetKey: KeyboardAction['key']) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }: KeyboardAction) => {
    if (key === targetKey) setKeyPressed(true);
  };

  const upHandler = ({ key }: KeyboardAction) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return keyPressed;
};

export default useKeyPress;
