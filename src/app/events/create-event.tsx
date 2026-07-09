import EventForm, { type EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function CreateEventScreen() {
    const router = useRouter();
    const addEvent = useEvents((state) => state.addEvent);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: EventFormValues) => {
        setLoading(true);
        try {
            await addEvent(values);
            Alert.alert("Event added", undefined, [
                {
                    text: "Ok",
                    onPress: router.back,
                },
            ]);
        } catch {
            Alert.alert("Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen edges={["bottom"]} style={styles.container}>
            <EventForm
                title="New event"
                onCancel={router.back}
                onSubmit={handleSubmit}
                submitButtonText="Add event"
                loading={loading}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 40,
    },
});
