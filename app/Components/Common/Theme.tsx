// ThemedComponents.tsx
import React, { ReactNode } from 'react';
import { View, Text, ViewProps, TextProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ThemedViewProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ style, children, ...props }) => {
    const { colors } = useTheme();
    return (
        <View style={[{ backgroundColor: colors.background }, style]} {...props}>
            {children}
        </View>
    );
};

interface ThemedTextProps extends TextProps {
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, children, ...props }) => {
    const { colors } = useTheme();
    return (
        <Text style={[{ color: colors.onBackground }, style]} {...props}>
            {children}
        </Text>
    );
};
