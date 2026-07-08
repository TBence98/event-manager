import { useAuth } from "@/store/auth";
import { Pressable, StyleSheet, Text } from "react-native";

export default function HeaderLogOutButton() {
    const logOut = useAuth((state) => state.logOut);

    return (
        <Pressable
            onPress={logOut}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
            <Text style={styles.text}>Log out</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E5EA",
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    pressed: {
        opacity: 0.7,
    },
});
