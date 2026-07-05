import { useAuth } from "@/store/auth";
import { Pressable, Text, View } from "react-native";

export default function LogInScreen() {
    const logIn = useAuth((state) => state.logIn);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Pressable onPress={() => logIn("test token")}>
                <Text>Log In</Text>
            </Pressable>
        </View>
    );
}
