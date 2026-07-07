import { useAuth } from "@/store/auth";
import { Pressable, StyleSheet, Text } from "react-native";

export default function HeaderLogOutButton() {
    const logOut = useAuth((state) => state.logOut);

    return (
        <Pressable
            onPress={logOut}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
            <Text style={styles.text}>Kijelentkezés</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDDDDD",
    },
    text: {
        fontSize: 16,
    },
    pressed: {
        opacity: 0.6,
    },
});
