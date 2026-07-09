import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import HeaderLogOutButton from "@/components/header-log-out-button";
import { useAuth } from "@/store/auth";
import { Platform } from "react-native";

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
                            statusBarStyle:
                                Platform.OS === "android" ? "dark" : undefined,
                        }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen
                        name="events"
                        options={{
                            headerTitle: "Events",
                            headerShadowVisible: false,
                            headerStyle: { backgroundColor: "#F2F2F7" },
                            statusBarStyle:
                                Platform.OS === "android" ? "dark" : undefined,
                            headerLeft: () => <HeaderLogOutButton />,
                        }}
                    />
                    <Stack.Screen
                        name="events/create-event"
                        options={{
                            headerTitle: "",
                            statusBarStyle:
                                Platform.OS === "android" ? "dark" : undefined,
                        }}
                    />
                    <Stack.Screen
                        name="events/edit-event/[id]"
                        options={{
                            headerTitle: "",
                            statusBarStyle:
                                Platform.OS === "android" ? "dark" : undefined,
                        }}
                    />
                </Stack.Protected>
            </Stack>
        </KeyboardProvider>
    );
}
