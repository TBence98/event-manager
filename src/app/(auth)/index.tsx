import { login } from "@/api/auth";
import LoaderScreen from "@/components/loader-screen";
import { Screen } from "@/components/screen";
import { useAuth } from "@/store/auth";
import { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

export default function LogInScreen() {
    const logIn = useAuth((state) => state.logIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error) {
            Alert.alert("Hibás email vagy jelszó!");
            setError(null);
        }
    }, [error]);

    async function handleLogIn() {
        setError(null);
        setIsLoading(true);

        try {
            const { token } = await login(email, password);
            logIn(token);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ismeretlen hiba");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <LoaderScreen />;
    }

    return (
        <Screen edges={["top", "bottom"]}>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                <View style={styles.content}>
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
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>
                <KeyboardStickyView offset={{ opened: 16 }}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.logInButton,
                            pressed && styles.loginButtonPressed,
                            isLoading && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogIn}
                        disabled={isLoading}
                    >
                        <Text style={styles.logInButtonText}>
                            {"Bejelentkezés"}
                        </Text>
                    </Pressable>
                </KeyboardStickyView>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    content: { flex: 1 },
    title: { marginTop: 40, fontSize: 42, fontWeight: 700, width: "70%" },
    textInputContainer: { marginTop: 40, gap: 28 },
    textInputLabelContainer: { gap: 4 },
    textInput: { padding: 12, backgroundColor: "#DDDDDD", borderRadius: 8 },
    logInButton: {
        paddingVertical: 12,
        width: "100%",
        borderRadius: 20,
        alignItems: "center",
        backgroundColor: "#000000",
    },
    loginButtonPressed: {
        opacity: 0.6,
    },
    loginButtonDisabled: {
        opacity: 0.5,
    },
    logInButtonText: { color: "#FFFFFF", fontSize: 20, fontWeight: 500 },
    errorText: { marginTop: 16, color: "#CC0000", fontSize: 14 },
});
