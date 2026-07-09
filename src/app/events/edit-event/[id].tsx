import EventForm, { type EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

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
            <EventForm
                key={event.id}
                title="Edit event"
                onCancel={router.back}
                onSubmit={handleSubmit}
                submitButtonText="Save event"
                loading={isSubmitting}
                name={event.name}
                city={event.location}
                country={event.country}
                capacity={event.capacity}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 40,
    },
});
