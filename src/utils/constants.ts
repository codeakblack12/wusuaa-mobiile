import { Dimensions, StatusBar, Platform, PixelRatio, Easing, UIManager, LayoutAnimation } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { RFPercentage } from 'react-native-responsive-fontsize';

export let WIDTH = Dimensions.get('screen').width;
export let HEIGHT = Dimensions.get('screen').height;

export const IOS = Platform.OS === 'ios';
export const ANDROID = Platform.OS === 'android';

export const COUNTER_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

export const FADE = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
};

export const layoutAnimation = () => {
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    LayoutAnimation.configureNext(LayoutAnimation?.Presets?.easeInEaseOut)
}

export const springLayoutAnimation = () => {
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    LayoutAnimation.configureNext(LayoutAnimation?.Presets?.spring)
}

export const linearLayoutAnimation = () => {
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    LayoutAnimation.configureNext(LayoutAnimation?.Presets?.linear)
}

const transitionSpec = {
    open: {
        animation: 'timing',
        config: {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        },
    },
    close: {
        animation: 'timing',
        config: {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        },
    },
};

const springTransitionSpec = {
    open: {
      animation: 'spring',
      config: {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      },
    },
};

export const BottomSheetTransition = {
    transitionSpec,
    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
 }

export const HorizontalTransition = {
    transitionSpec,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
}

export const ModalTransition = {
    transitionSpec: springTransitionSpec,
    cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
}

const widthPercentageToDP = (widthPercent: number | string) => {
    // Parse string percentage input and convert it to number.
    const elemWidth =
      typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((WIDTH * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent: number | string) => {
    // Parse string percentage input and convert it to number.
    const elemHeight =
        typeof heightPercent === 'number'
        ? heightPercent
        : parseFloat(heightPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((HEIGHT * elemHeight) / 100);
};

export const hp = (val: number) => {
    // get scaled height equivalent of design height
    const num = val / 8.44;
    return heightPercentageToDP(num);
};

export const wp = (val: number) => {
    // get scaled width equivalent of design width
    const num = val / 3.88;
    return widthPercentageToDP(num);
};

export const fontSz = (val: number) => RFPercentage(val / 8.5);

export const HITSLOP = {
    right: wp(10),
    left: wp(10),
    top: hp(10),
    bottom: hp(10),
};

export const STATUS_BAR_HEIGHT = StatusBar.currentHeight || hp(28);