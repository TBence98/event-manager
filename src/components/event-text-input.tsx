import {
    KeyboardTypeOptions,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from "react-native";

type EventTextInputProps = {
    inputValue?: string;
    label: string;
    onTextChange: (text: string) => void;
    style?: StyleProp<ViewStyle>;
    keyboardType?: KeyboardTypeOptions;
};

export default function EventTextInput({
    inputValue,
    label,
    onTextChange,
    style,
    keyboardType,
}: EventTextInputProps) {
    return (
        <View style={style}>
            <Text>{label}</Text>
            <TextInput
                style={styles.textInput}
                value={inputValue}
                onChangeText={onTextChange}
                keyboardType={keyboardType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: "#898989",
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
});
