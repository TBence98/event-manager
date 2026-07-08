import EventForm, { EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

export default function EditEventScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const event = useEvents((state) =>
        state.events.find((item) => item.id === id),
    );
    const updateEventById = useEvents((state) => state.updateEventById);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) {
            Alert.alert("Error", "Missing event id", [
                { text: "Ok", onPress: router.back },
            ]);
            return;
        }

        if (!event) {
            Alert.alert("Error", "Event not found", [
                { text: "Ok", onPress: router.back },
            ]);
        }
    }, [event, id, router]);

    const handleSubmit = async (values: EventFormValues) => {
        if (!id) {
            return;
        }

        setIsSubmitting(true);

        try {
            await updateEventById(id, values);
            Alert.alert("Event updated", undefined, [
                {
                    text: "Ok",
                    onPress: router.back,
                },
            ]);
        } catch {
            Alert.alert("Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!id || !event) {
        return null;
    }

    return (
        <Screen edges={["bottom"]} style={styles.container}>
            <View style={{ flex: 1, justifyContent: "space-between" }}>
                <Text style={styles.title}>Edit event</Text>
                <KeyboardStickyView offset={{ opened: 16 }}>
                    <EventForm
                        key={event.id}
                        onCancel={router.back}
                        onSubmit={handleSubmit}
                        submitButtonText="Save event"
                        loading={isSubmitting}
                        name={event.name}
                        city={event.location}
                        country={event.country}
                        capacity={event.capacity}
                    />
                </KeyboardStickyView>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: { marginVertical: 28, fontSize: 24, fontWeight: 600 },
    container: {
        paddingHorizontal: 40,
    },
});
