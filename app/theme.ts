import type { StyleFunctionProps, ThemeConfig } from '@chakra-ui/react';
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

const Button = defineStyleConfig({
  // the styles all buttons have in common
  baseStyle: {
    fontWeight: 'bold',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: '0px',
    transition: 'transform 0.15s ease-out, background 0.15s ease-out',
    _hover: {
      transform: 'scale(1.05)',
    },
    _active: {
      transform: 'scale(1,1)',
    },
  },
  // two sides: lg and sm
  sizes: {
    lg: {
      fontSize: '15px',
      h: '48px',
    },
    sm: {
      fontSize: ['13px', '15px'],
      h: '40px',
    },
  },
  // two variants: primary and secondary
  variants: {
    primary: {
      borderRadius: 'full',
      bg: '_purple.700',
      color: 'white',
      _hover: {
        bg: '_purple.400',
        _dark: {
          bg: '_purple.400',
        },
      },
      _active: {
        bg: '_purple.700',
        _dark: {
          bg: '_purple.400',
        },
      },
    },
    secondary: {
      borderRadius: 'full',
      bg: 'gray.100',
      color: '_purple.700',
      _hover: {
        bg: '_purple.50',
        _dark: {
          bg: 'white',
        },
      },
      _active: {
        bg: '_purple.50',
        _dark: {
          bg: 'white',
        },
      },
    },
    delete: {
      borderRadius: 'full',
      bg: '_red.700',
      color: 'white',
      _hover: {
        bg: '_red.400',
        _dark: {
          bg: '_red.400',
        },
      },
      _active: {
        bg: '_red.700',
        _dark: {
          bg: '_red.400',
        },
      },
    },
  },
  // the default size and variant values
  defaultProps: {
    variant: 'primary',
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
    _gray: {
      50: '#f4f7fd',
      100: '#dcdfe6',
      200: '#c5c7cf',
      300: '#adb0b7',
      400: '#9698a0',
      500: '#7e8089',
      600: '#676872',
      700: '#4f515a',
      800: '#383943',
      900: '#20212c',
    },
    _red: {
      50: '#fbdede',
      100: '#fbdbdb',
      200: '#f8c9c9',
      300: '#f6b6b6',
      400: '#ff9898',
      500: '#ef8080',
      600: '#ed6e6e',
      700: '#ea5555',
      800: '#e63737',
      900: '#da1b1b',
    },
    _purple: {
      50: '#c4c1ff',
      100: '#bebbff',
      200: '#b7b4ff',
      300: '#b0acff',
      400: '#a8a4ff',
      500: '#928eec',
      600: '#7c78d8',
      700: '#635fc7',
      800: '#4e4abf',
      900: '#3e3aa6',
    },
  },

  components: {
    Button,
    Input: {
      variants: {
        outline: (props: StyleFunctionProps) => {
          const { colorScheme: c } = props;
          return {
            field: {
              _focusVisible: {
                boxShadow: `none`,
                borderColor: `none`,
              },
              errorBorderColor: `yelow`,
            },
          };
        },
      },
    },
    Switch: switchTheme,
  },

  textStyles: {
    h1: {
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '1.25',
    },
    h2: {
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '1.25',
    },
    h3: {
      fontSize: '15px',
      fontWeight: 'bold',
      lineHeight: '1.25',
    },
    h4: {
      fontSize: '13px',
      fontWeight: 'bold',
      lineHeight: '1.25',
      kerning: '2.4px',
    },
    lg: {
      fontSize: '15px',
      fontWeight: 'medium',
      lineHeight: '1.5',
    },
    md: {
      fontSize: ['13px', '15px'],
      fontWeight: 'medium',
      lineHeight: '1.5',
    },
    sm: {
      fontSize: ['11px', '13px'],
      fontWeight: 'medium',
      lineHeight: '1.5',
    },
  },
});

export default theme;
