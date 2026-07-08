import { Event } from "@/types/event";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type EventCardProps = {
    event: Event;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
};

type EventDetailRowProps = {
    label: string;
    value: string;
};

function EventDetailRow({ label, value }: EventDetailRowProps) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
                {value}
            </Text>
        </View>
    );
}

export default function EventCard({
    event,
    onDelete,
    isDeleting = false,
}: EventCardProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.eventName} numberOfLines={2}>
                {event.name}
            </Text>

            <View style={styles.details}>
                <EventDetailRow label="Location" value={event.location} />
                <EventDetailRow label="Country" value={event.country ?? "—"} />
                <EventDetailRow
                    label="Capacity"
                    value={
                        event.capacity != null ? String(event.capacity) : "—"
                    }
                />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={() =>
                        router.navigate(`/events/edit-event/${event.id}`)
                    }
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.editButton,
                        pressed && styles.actionButtonPressed,
                    ]}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.deleteButton,
                        pressed && !isDeleting && styles.actionButtonPressed,
                        isDeleting && styles.actionButtonDisabled,
                    ]}
                    onPress={() => onDelete(event.id)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <ActivityIndicator color="#FF3B30" size="small" />
                    ) : (
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        gap: 16,
        boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.0.06)",
    },
    eventName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1C1C1E",
        lineHeight: 26,
    },
    details: {
        gap: 10,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    detailLabel: {
        width: 72,
        fontSize: 14,
        color: "#8E8E93",
    },
    detailValue: {
        flex: 1,
        fontSize: 15,
        color: "#1C1C1E",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    actionButton: {
        flex: 1,
        minHeight: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    editButton: {
        backgroundColor: "#1C1C1E",
    },
    deleteButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FF3B30",
    },
    actionButtonPressed: {
        opacity: 0.7,
    },
    actionButtonDisabled: {
        opacity: 0.6,
    },
    editButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    deleteButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FF3B30",
    },
});
