import EventCard from "@/components/event-card";
import LoaderScreen from "@/components/loader-screen";
import { Screen } from "@/components/screen";
import { useEvents } from "@/store/events";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventsScreen() {
    const events = useEvents((state) => state.events);
    const isInitialLoading = useEvents((state) => state.isInitialLoading);
    const isLoadingMore = useEvents((state) => state.isLoadingMore);
    const deletingEventId = useEvents((state) => state.deletingEventId);
    const error = useEvents((state) => state.error);
    const loadInitial = useEvents((state) => state.loadInitial);
    const loadMore = useEvents((state) => state.loadMore);
    const deleteEventById = useEvents((state) => state.deleteEventById);
    const clearError = useEvents((state) => state.clearError);

    const { bottom } = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        if (error) {
            Alert.alert("Failed to load events");
            clearError();
        }
    }, [clearError, error]);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await deleteEventById(id);
            } catch (err) {
                Alert.alert(
                    "Delete failed",
                    err instanceof Error ? err.message : "Unknown error",
                );
            }
        },
        [deleteEventById],
    );

    if (isInitialLoading) {
        return <LoaderScreen />;
    }

    const eventCountLabel =
        events.length === 1 ? "1 event" : `${events.length} events`;

    return (
        <Screen style={styles.container}>
            <FlashList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onDelete={handleDelete}
                        isDeleting={deletingEventId === item.id}
                    />
                )}
                contentContainerStyle={[
                    styles.listContentContainerStyle,
                    events.length === 0 && styles.emptyListContent,
                    { paddingBottom: bottom + 96 },
                ]}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListHeaderComponent={
                    events.length > 0
                        ? () => (
                              <Text style={styles.subtitle}>
                                  {eventCountLabel}
                              </Text>
                          )
                        : null
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>
                            No events yet
                        </Text>
                        <Text style={styles.emptyStateText}>
                            Tap the + button to create your first event.
                        </Text>
                    </View>
                )}
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator
                            size="large"
                            color="#1C1C1E"
                            style={styles.footerLoaderStyle}
                        />
                    ) : null
                }
            />
            <Pressable
                onPress={() => router.navigate("/events/create-event")}
                style={({ pressed }) => [
                    styles.addButton,
                    { bottom: bottom + 24 },
                    pressed && styles.pressedButton,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Create event"
            >
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: "#F2F2F7",
    },
    subtitle: {
        fontSize: 15,
        color: "#8E8E93",
        marginBottom: 16,
    },
    listContentContainerStyle: {
        paddingTop: 8,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    itemSeparator: { height: 24 },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingTop: 80,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1C1C1E",
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
        lineHeight: 22,
    },
    footerLoaderStyle: { marginTop: 20, marginBottom: 8 },
    addButton: {
        position: "absolute",
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1C1C1E",
        boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
    },
    addButtonText: {
        fontSize: 32,
        fontWeight: "400",
        color: "#FFFFFF",
        lineHeight: 34,
        marginTop: -2,
    },
    pressedButton: {
        opacity: 0.75,
        transform: [{ scale: 0.96 }],
    },
});
