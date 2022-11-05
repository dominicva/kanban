import type { ThemeConfig } from '@chakra-ui/react';
import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultVariant,
} from '@chakra-ui/react';
import * as components from './components';
import { colors, textStyles } from './foundations';

const theme: ThemeConfig = extendTheme(
  {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: true,
    },
    components,
    colors,
    textStyles,
  },
  withDefaultVariant({
    variant: 'custom',
    components: ['Switch'],
  }),
  withDefaultColorScheme({
    colorScheme: '_purple',
    components: ['Switch'],
  })
);

export default theme;
