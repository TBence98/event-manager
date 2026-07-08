import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoaderScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
