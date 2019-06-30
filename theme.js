import { Platform } from 'react-native';
import { colors } from 'react-native-elements';

export const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
};
