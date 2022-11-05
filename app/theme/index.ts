import type { ThemeConfig } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import * as components from './components';
import { colors, textStyles } from './foundations';

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  components,
  colors,
  textStyles,
});

export default theme;
