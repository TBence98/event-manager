import { login } from "@/api/auth";
import LoaderScreen from "@/components/loader-screen";
import { Screen } from "@/components/screen";
import { useAuth } from "@/store/auth";
import { validateLoginForm } from "@/utils/validation";
import { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    KeyboardAwareScrollView,
    KeyboardStickyView,
} from "react-native-keyboard-controller";

export default function LogInScreen() {
    const logIn = useAuth((state) => state.logIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (authError) {
            Alert.alert("Wrong email or password!");
            setAuthError(null);
        }
    }, [authError]);

    async function handleLogIn() {
        setAuthError(null);

        const validation = validateLoginForm(email, password);
        if (!validation.isValid || !validation.values) {
            setFieldErrors(validation.errors);
            return;
        }

        setFieldErrors({});
        setIsLoading(true);

        try {
            const { token } = await login(
                validation.values.email,
                validation.values.password,
            );
            logIn(token);
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Unknown error");
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
                <KeyboardAwareScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    bottomOffset={Platform.OS === "ios" ? 120 : 80}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Log in to your account</Text>
                    <View style={styles.textInputContainer}>
                        <View style={styles.textInputLabelContainer}>
                            <Text>Email</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    fieldErrors.email && styles.textInputError,
                                ]}
                                placeholder="email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (fieldErrors.email) {
                                        setFieldErrors((current) => ({
                                            ...current,
                                            email: undefined,
                                        }));
                                    }
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {fieldErrors.email ? (
                                <Text style={styles.errorText}>
                                    {fieldErrors.email}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.textInputLabelContainer}>
                            <Text>Password</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    fieldErrors.password &&
                                        styles.textInputError,
                                ]}
                                placeholder="password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (fieldErrors.password) {
                                        setFieldErrors((current) => ({
                                            ...current,
                                            password: undefined,
                                        }));
                                    }
                                }}
                                secureTextEntry
                            />
                            {fieldErrors.password ? (
                                <Text style={styles.errorText}>
                                    {fieldErrors.password}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <KeyboardStickyView
                    offset={{ opened: Platform.OS === "ios" ? 16 : 0 }}
                >
                    <Pressable
                        style={({ pressed }) => [
                            styles.logInButton,
                            pressed && styles.loginButtonPressed,
                            isLoading && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogIn}
                        disabled={isLoading}
                    >
                        <Text style={styles.logInButtonText}>{"Log in"}</Text>
                    </Pressable>
                </KeyboardStickyView>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    title: { marginTop: 40, fontSize: 42, fontWeight: 700, width: "70%" },
    textInputContainer: { marginTop: 40, gap: 28 },
    textInputLabelContainer: { gap: 4 },
    textInput: { padding: 12, backgroundColor: "#DDDDDD", borderRadius: 8 },
    textInputError: {
        borderWidth: 1,
        borderColor: "#CC0000",
    },
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
    errorText: { marginTop: 4, color: "#CC0000", fontSize: 14 },
});
