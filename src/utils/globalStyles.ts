import { StyleSheet } from 'react-native';
import { wp, hp, fontSz } from './constants';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.primaryBg,
        padding: hp(15)
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowBetweenNoCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowAround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: hp(15)
    },
})