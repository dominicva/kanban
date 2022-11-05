import { defineStyleConfig } from '@chakra-ui/styled-system';

export default defineStyleConfig({
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
  defaultProps: {
    variant: 'primary',
  },
});
