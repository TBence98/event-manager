import { Screen } from "@/components/screen";
import { Text } from "react-native";

export default function createEvent() {
    return (
        <Screen
            edges={["bottom", "top"]}
            style={{ alignItems: "center", justifyContent: "center" }}
        >
            <Text>Create Event</Text>
        </Screen>
    );
}
