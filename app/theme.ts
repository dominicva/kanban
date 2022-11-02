import type { ThemeConfig } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const baseStyle = defineStyle({
  borderRadius: '20px',
  fontWeight: 'bold',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: '13px',
  lineHeight: '23px',
});

const customVariant = defineStyle(props => {
  const { colorScheme: c } = props;
  return {
    bg: `${c}.500`,
    color: 'white',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '13px',
    lineHeight: '23px',
    transition: 'transform 0.15s ease-out, backgroun 0.15s ease-out',
    _dark: {
      bg: `${c}.200`,
      color: 'gray.900',
    },
    _hover: {
      bg: `${c}.600`,
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
  baseStyle,
  variants: {
    custom: customVariant,
  },
  defaultProps: {
    colorScheme: 'purple',
  },
});

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  components: {
    Button: buttonTheme,
  },
});

export default theme;
