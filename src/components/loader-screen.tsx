import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoaderScreen() {
    return (
        <View style={stlyes.container}>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    );
}

const stlyes = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
