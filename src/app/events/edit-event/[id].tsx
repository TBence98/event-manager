import { Screen } from "@/components/screen";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function editEvent() {
    const { id } = useLocalSearchParams();

    return (
        <Screen
            edges={["bottom", "top"]}
            style={{ alignItems: "center", justifyContent: "center" }}
        >
            <Text>{id}</Text>
        </Screen>
    );
}
