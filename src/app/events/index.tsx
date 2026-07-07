import { fetchEvents } from "@/api/events";
import EventCard from "@/components/EventCard";
import LoaderScreen from "@/components/loader-screen";
import { Screen } from "@/components/screen";
import type { Event } from "@/types/event";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

export default function EventsScreen() {
    const [events, setEvents] = useState<Event[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { bottom } = useSafeAreaInsets();

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

    if (isInitialLoading) {
        return <LoaderScreen />;
    }

    return (
        <Screen style={styles.container}>
            <FlashList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EventCard event={item} />}
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
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator
                            size="large"
                            style={styles.footerLoaderStyle}
                        />
                    ) : null
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16 },
    listContentContainerStyle: { paddingTop: 30 },
    itemSeparator: { height: 16 },
    footerLoaderStyle: { marginTop: 20 },
});
