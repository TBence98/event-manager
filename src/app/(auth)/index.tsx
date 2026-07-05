import { Screen } from "@/components/screen";
import { useAuth } from "@/store/auth";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LogInScreen() {
    const logIn = useAuth((state) => state.logIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Screen edges={["top", "bottom"]}>
            <View style={styles.container}>
                <Text style={styles.title}>Belépés a Fiokódba</Text>
                <View style={styles.textInputContainer}>
                    <View style={styles.textInputLabelContainer}>
                        <Text>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View style={styles.textInputLabelContainer}>
                        <Text>Jelszó</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="jelszó"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.logInButton,
                        pressed && styles.loginButtonPressed,
                    ]}
                    onPress={() => logIn("test token")}
                >
                    <Text style={styles.logInButtonText}>Bejelentkezés</Text>
                </Pressable>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    title: { marginTop: 40, fontSize: 42, fontWeight: 700, width: "70%" },
    textInputContainer: { marginTop: 40, gap: 28 },
    textInputLabelContainer: { gap: 4 },
    textInput: { padding: 12, backgroundColor: "#DDDDDD", borderRadius: 8 },
    logInButton: {
        marginTop: "auto",
        paddingVertical: 12,
        width: "100%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: "#000000",
    },
    loginButtonPressed: {
        opacity: 0.6,
    },
    logInButtonText: { color: "#FFFFFF", fontSize: 20, fontWeight: 500 },
});
