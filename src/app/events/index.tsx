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
            Alert.alert("Az események betöltése sikertelen");
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
                    "Törlés sikertelen",
                    err instanceof Error ? err.message : "Ismeretlen hiba",
                );
            }
        },
        [deleteEventById],
    );

    if (isInitialLoading) {
        return <LoaderScreen />;
    }

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
                    {
                        paddingBottom: bottom,
                    },
                ]}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeparator} />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListHeaderComponent={() => (
                    <Text style={styles.title}>Események</Text>
                )}
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator
                            size="large"
                            style={styles.footerLoaderStyle}
                        />
                    ) : null
                }
            />
            <Pressable
                onPress={() => router.navigate("/events/create-event")}
                style={({ pressed }) => [
                    styles.addButton,
                    pressed && styles.pressedButton,
                ]}
            >
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16 },
    title: {
        fontSize: 30,
        fontWeight: 700,
        marginBottom: 32,
        textAlign: "center",
    },
    listContentContainerStyle: { paddingTop: 30 },
    itemSeparator: { height: 16 },
    footerLoaderStyle: { marginTop: 20 },
    addButton: {
        position: "absolute",
        bottom: 40,
        right: 40,
        minHeight: 54,
        minWidth: 54,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "orange",
    },
    addButtonText: {
        fontSize: 34,
        fontWeight: 700,
    },
    pressedButton: {
        opacity: 0.6,
    },
});
