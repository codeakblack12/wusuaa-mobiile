import { Platform } from "react-native";

const Fonts = {
    ExtraBold: Platform.OS == 'ios' ? "Avenir" : 'Satoshi-Black',
    Bold: Platform.OS == 'ios' ? "Avenir" : 'Satoshi-Bold',
    Medium: Platform.OS == 'ios' ? "Avenir" : 'Satoshi-Medium',
    Regular: Platform.OS == 'ios' ? "Avenir" : 'Satoshi-Regular',
    Light: Platform.OS == 'ios' ? "Avenir" : 'Satoshi-Light'
}

export default Fonts;