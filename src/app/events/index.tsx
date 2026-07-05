import { useAuth } from "@/store/auth";
import { Pressable, Text, View } from "react-native";

export default function EventsScreen() {
    const logOut = useAuth((state) => state.logOut);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Pressable onPress={logOut}>
                <Text>Events</Text>
            </Pressable>
        </View>
    );
}
