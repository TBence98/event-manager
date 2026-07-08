import { validateEventForm, type EventFormField } from "@/utils/validation";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import EventTextInput from "./event-text-input";

export type EventFormValues = {
    name: string;
    location: string;
    country?: string;
    capacity?: number;
};

type EventFormProps = {
    onCancel: () => void;
    onSubmit: (values: EventFormValues) => void;
    submitButtonText: string;
    loading: boolean;
    name?: string;
    city?: string;
    country?: string;
    capacity?: number;
};

export default function EventForm({
    onCancel,
    onSubmit,
    submitButtonText,
    loading,
    name = "",
    city = "",
    country = "",
    capacity,
}: EventFormProps) {
    const [nameVal, setNameVal] = useState(name);
    const [cityVal, setCityVal] = useState(city);
    const [countryVal, setCountryVal] = useState(country);
    const [capacityVal, setCapacityVal] = useState(
        !capacity ? "" : String(capacity),
    );
    const [errors, setErrors] = useState<
        Partial<Record<EventFormField, string>>
    >({});

    function clearFieldError(field: EventFormField) {
        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    function handleSubmit() {
        const result = validateEventForm({
            name: nameVal,
            location: cityVal,
            country: countryVal,
            capacity: capacityVal,
        });

        if (!result.isValid || !result.values) {
            setErrors(result.errors);
            return;
        }

        setErrors({});
        onSubmit(result.values);
    }

    return (
        <View style={styles.container}>
            <EventTextInput
                label="Name"
                inputValue={nameVal}
                onTextChange={(text) => {
                    setNameVal(text);
                    clearFieldError("name");
                }}
                error={errors.name}
                style={styles.textInputContainer}
            />
            <Text style={styles.placeText}>PLACE</Text>
            <EventTextInput
                label="City"
                inputValue={cityVal}
                onTextChange={(text) => {
                    setCityVal(text);
                    clearFieldError("location");
                }}
                error={errors.location}
                maxLength={100}
                style={styles.textInputContainer}
            />
            <EventTextInput
                label="Country"
                inputValue={countryVal}
                onTextChange={(text) => {
                    setCountryVal(text);
                    clearFieldError("country");
                }}
                error={errors.country}
                style={styles.textInputContainer}
            />
            <EventTextInput
                label="Capacity"
                inputValue={capacityVal}
                onTextChange={(text) => {
                    setCapacityVal(text);
                    clearFieldError("capacity");
                }}
                error={errors.capacity}
                style={{
                    ...styles.textInputContainer,
                    ...styles.capacityTextInputContainer,
                }}
                keyboardType="number-pad"
            />
            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={onCancel}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.button,
                        styles.submitButton,
                        pressed && styles.pressed,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text
                            style={[styles.buttonText, styles.submitButtonText]}
                        >
                            {submitButtonText}
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%" },
    placeText: { marginTop: 12, marginBottom: 4, fontWeight: 700 },
    textInputContainer: {
        marginBottom: 12,
    },
    capacityTextInputContainer: { marginTop: 24, width: "40%" },
    buttonContainer: {
        marginTop: 8,
        flexDirection: "row",
        gap: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        minHeight: 44,
        minWidth: 140,
    },
    submitButton: { backgroundColor: "#0090EE" },
    buttonText: { fontSize: 16, fontWeight: 500 },
    submitButtonText: { color: "#FFFFFF" },
    pressed: { opacity: 0.6 },
});
