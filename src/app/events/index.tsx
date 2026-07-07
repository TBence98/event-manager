import { deleteEvent, fetchEvents } from "@/api/events";
import EventCard from "@/components/EventCard";
import LoaderScreen from "@/components/loader-screen";
import { Screen } from "@/components/screen";
import type { Event } from "@/types/event";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

export default function EventsScreen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { bottom } = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        if (error) {
            Alert.alert("Az események betöltése sikertelen");
            setError(null);
        }
    }, [error]);

    const isFetchingRef = useRef(false);

    const loadEvents = useCallback(async (cursor?: string) => {
        if (isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;
        setError(null);

        const isFirstPage = cursor === undefined;
        if (isFirstPage) {
            setIsInitialLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await fetchEvents({
                limit: PAGE_SIZE,
                cursor,
            });

            setEvents((currentEvents) =>
                isFirstPage
                    ? response.events
                    : [...currentEvents, ...response.events],
            );
            setNextCursor(response.nextCursor);
            setHasMore(response.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            isFetchingRef.current = false;
            setIsInitialLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleLoadMore = useCallback(() => {
        if (!hasMore || isLoadingMore || isInitialLoading || !nextCursor) {
            return;
        }

        loadEvents(nextCursor);
    }, [hasMore, isInitialLoading, isLoadingMore, loadEvents, nextCursor]);

    const handleDelete = useCallback(async (id: string) => {
        setDeletingEventId(id);

        try {
            await deleteEvent(id);

            setEvents((currentEvents) => {
                const remainingEvents = currentEvents.filter(
                    (event) => event.id !== id,
                );

                setNextCursor((currentCursor) => {
                    if (currentCursor !== id) {
                        return currentCursor;
                    }

                    return remainingEvents.at(-1)?.id ?? null;
                });

                return remainingEvents;
            });
        } catch (err) {
            Alert.alert(
                "Törlés sikertelen",
                err instanceof Error ? err.message : "Ismeretlen hiba",
            );
        } finally {
            setDeletingEventId(null);
        }
    }, []);

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
                onEndReached={handleLoadMore}
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
