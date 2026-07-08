import EventForm, { EventFormValues } from "@/components/event-form";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
} from "react-native-reanimated";

export default function CreateEventScreen() {
    const router = useRouter();
    const addEvent = useEvents((state) => state.addEvent);
    const [loading, setLoading] = useState(false);
    const { progress } = useReanimatedKeyboardAnimation();

    const offset = useDerivedValue(() => {
        return interpolate(progress.value, [0, 1], [0, 72]);
    });

    const keyboardAwareStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -offset.value }],
    }));

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
            <Animated.View style={keyboardAwareStyle}>
                <Text style={styles.title}>New event</Text>
                <EventForm
                    onCancel={router.back}
                    onSubmit={handleSubmit}
                    submitButtonText="Add event"
                    loading={loading}
                />
            </Animated.View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: { marginVertical: 28, fontSize: 24, fontWeight: 600 },
    container: {
        paddingHorizontal: 40,
    },
});
