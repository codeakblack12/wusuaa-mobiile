import React from 'react';
import { View, ActivityIndicator, StyleSheet, ColorValue, ViewStyle, ActivityIndicatorProps } from 'react-native';

interface SpinnerProps {
  size?: ActivityIndicatorProps;
  style?: ViewStyle;
  color?: ColorValue;
}

const styles = StyleSheet.create({
  spinnerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Spinner: React.FC<SpinnerProps>= (props) => {
  const { size, style, color } = props;
  const spinnerColor =  color || '#FFFFFF';

  return(
    <View style={[styles.spinnerStyle, style]}>
      <ActivityIndicator
          size={size || 'large'}
          color={spinnerColor}
      />
    </View>
  );
};

export { Spinner };