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
    error?: string;
    maxLength?: number;
};

export default function EventTextInput({
    inputValue,
    label,
    onTextChange,
    style,
    keyboardType,
    error,
    maxLength,
}: EventTextInputProps) {
    return (
        <View style={style}>
            <Text>{label}</Text>
            <TextInput
                style={[styles.textInput, error && styles.textInputError]}
                value={inputValue}
                onChangeText={onTextChange}
                keyboardType={keyboardType}
                maxLength={maxLength}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    textInputError: {
        borderColor: "#CC0000",
    },
    errorText: {
        marginTop: 4,
        color: "#CC0000",
        fontSize: 13,
    },
});
