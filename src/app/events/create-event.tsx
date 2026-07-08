import EventForm, { EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

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
            <View style={{ flex: 1, justifyContent: "space-between" }}>
                <Text style={styles.title}>New event</Text>
                <KeyboardStickyView offset={{ opened: 16 }}>
                    <EventForm
                        onCancel={router.back}
                        onSubmit={handleSubmit}
                        submitButtonText="Add event"
                        loading={loading}
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
