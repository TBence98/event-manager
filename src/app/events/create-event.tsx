import { createEvent } from "@/api/events";
import EventForm, { EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

export default function createEventScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: EventFormValues) => {
        setLoading(true);
        try {
            await createEvent(values);
            Alert.alert("Event added", undefined, [
                {
                    text: "Ok",
                    onPress: router.back,
                },
            ]);
        } catch (e) {
            Alert.alert("Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen edges={["bottom"]} style={styles.container}>
            <Text style={styles.title}>New event</Text>
            <EventForm
                onCancel={router.back}
                onSubmit={handleSubmit}
                submitButtonText="Add event"
                loading={loading}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: { marginVertical: 28, fontSize: 24, fontWeight: 600 },
    container: {
        paddingHorizontal: 40,
    },
});
