import React, { type PropsWithChildren } from 'react';
import { Text, StyleSheet, TextStyle, Animated } from 'react-native';
import { fontSz } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';

export const BaseText: React.FC<
    PropsWithChildren<{
        onPress?: () => {};
        style?: TextStyle;
        selectable?: boolean;
        numberOfLines?: number;
        opacity?: number;
        animated?: boolean;
        lineHeight?: number;
    }>
> = ({
        children,
        style,
        selectable,
        numberOfLines,
        onPress,
        animated,
        lineHeight
}) => {
        return (
            <>
                {animated ?
                    <Animated.Text
                        numberOfLines={numberOfLines}
                        onPress={onPress}
                        selectable={selectable}
                        style={[styles.textStyle, style, { lineHeight }]}>
                        {children}
                    </Animated.Text>
                    :
                    <Text
                        numberOfLines={numberOfLines}
                        onPress={onPress}
                        selectable={selectable}
                        style={[styles.textStyle, style, { lineHeight }]}>
                        {children}
                    </Text>
                }
            </>
        )
    }

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: Fonts.Regular,
        fontSize: fontSz(14),
        color: colors.primaryTxt,
    },
});