import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const custom = defineStyle(props => {
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

export default defineStyleConfig({
  variants: {
    custom,
  },
});
