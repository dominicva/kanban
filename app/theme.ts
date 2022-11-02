import type { ThemeConfig } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const customSwitch = defineStyle(props => {
  const { colorScheme: c } = props;
  return {
    track: {
      bg: `${c}.900`,
      alignItems: 'center',
      height: '20px',
      width: '40px',
      _checked: {
        bg: `${c}.900`,
      },
    },
    thumb: {
      transition: 'transform 0.2s',
      transform: 'translateX(2px)',
      _checked: {
        transform: 'translateX(20px)',
      },
    },
  };
});

const customVariant = defineStyle(props => {
  const { colorScheme: c } = props;
  return {
    bg: `${c}.900`,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '13px',
    px: '32px',
    transition: 'transform 0.15s ease-out, background 0.15s ease-out',
    _dark: {
      bg: `${c}.900`,
      _hover: {
        bg: `${c}.600`,
      },
    },
    _hover: {
      bg: `${c}.700`,
      transform: 'scale(1.05)',
      _dark: {
        bg: `${c}.300`,
      },
    },
    _active: {
      bg: `${c}.700`,
      transform: 'scale(1, 1)',
      _dark: {
        bg: `${c}.400`,
      },
    },
  };
});

export const buttonTheme = defineStyleConfig({
  variants: {
    custom: customVariant,
  },
});

export const switchTheme = defineStyleConfig({
  variants: {
    custom: customSwitch,
  },
});

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  colors: {
    primary: {
      50: '#E0DFF4',
      100: '#eeedf9ff',
      200: '#dcdbf3ff',
      300: '#cbcaecff',
      400: '#bab8e6ff',
      500: '#a8a6e0ff',
      600: '#9794daff',
      700: '#8683d3ff',
      800: '#7471cdff',
      900: '#635fc7ff',
    },
    customRed: {
      50: '#FDEEEEff',
      100: '#FBDDDDff',
      200: '#F9CCCCff',
      300: '#F7BBBBff',
      400: '#F5AAAAff',
      500: '#F29999ff',
      600: '#F08888ff',
      700: '#EE7777ff',
      800: '#EC6666ff',
      900: '#EA5555ff',
    },
  },

  components: {
    Button: buttonTheme,
    Switch: switchTheme,
  },
});

export default theme;
