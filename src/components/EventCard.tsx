import { Event } from "@/types/event";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EventCard({ event }: { event: Event }) {
    return (
        <View style={styles.container}>
            <Text style={styles.eventText}>{"Esemény: " + event.name}</Text>
            <Text style={styles.eventText}>
                {"Helyszín: " + event.location}
            </Text>
            <Text style={styles.eventText}>
                {"Ország: " + (event.country ?? "-")}
            </Text>
            <Text style={styles.eventText}>
                {"Férőhelyek: " + (event.capacity ?? "-")}
            </Text>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.editButton,
                        pressed && styles.actionButtonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>Szerkesztés</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.deleteButton,
                        pressed && styles.actionButtonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>Törlés</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        gap: 8,
    },
    eventText: {
        fontSize: 16,
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
    },
    actionButton: {
        minWidth: 120,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
    },
    editButton: {
        backgroundColor: "#007AFF",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
    },
    actionButtonPressed: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 600,
    },
});
