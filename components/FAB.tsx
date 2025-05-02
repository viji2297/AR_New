import React, { useState, useEffect } from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';

interface MyComponentProps {
  animatedValue?: Animated.Value;
  visible: boolean;
  label: string;
  extended: boolean;
  onPress: () => void;
  animateFrom: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  iconMode?: 'dynamic' | 'static';
  buttonColor: string;
  iconName: string;
  showAddModal: () => void;
}

const FloatingButton: React.FC<MyComponentProps> = ({
  visible,
  label,
  animateFrom,
  style,
  iconMode,
  extended,
  iconName,
  buttonColor,
  onPress,
  animatedValue,
}) => {
  const [isExtended, setIsExtended] = useState(true);

  useEffect(() => {
    if (!animatedValue) return;

    const listenerId = animatedValue.addListener(({ value }) => {
      setIsExtended(value <= 0);
    });

    return () => animatedValue.removeListener(listenerId);
  }, [animatedValue]);

  const fabStyle = { [animateFrom]: 16 };

  return (
    <AnimatedFAB
      icon={iconName}
      label={label}
      extended={extended}
      onPress={onPress}
      visible={visible}
      animateFrom={animateFrom}
      iconMode={iconMode}
      color="white"
      style={[styles.fabStyle, style, fabStyle, { backgroundColor: buttonColor }]}
    />
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 20,
    position: 'absolute',
  },
});
