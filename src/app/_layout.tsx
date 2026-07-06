import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { useAuth } from "@/store/auth";

SplashScreen.preventAutoHideAsync();

export default function StackLayout() {
    const isLoggedIn = useAuth((state) => state.isLoggedIn);
    return (
        <KeyboardProvider>
            <AnimatedSplashOverlay />
            <Stack>
                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen
                        name="(auth)"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen name="events" />
                </Stack.Protected>
            </Stack>
        </KeyboardProvider>
    );
}
