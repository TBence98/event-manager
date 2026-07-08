import {
    createEvent as createEventApi,
    deleteEvent as deleteEventApi,
    fetchEvents,
    updateEvent as updateEventApi,
} from "@/api/events";
import type { CreateEventPayload, Event, UpdateEventPayload } from "@/types/event";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const PAGE_SIZE = 10;

type EventsState = {
    events: Event[];
    nextCursor: string | null;
    hasMore: boolean;
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    deletingEventId: string | null;
    error: string | null;
};

type EventsActions = {
    loadInitial: () => Promise<void>;
    loadMore: () => Promise<void>;
    deleteEventById: (id: string) => Promise<void>;
    addEvent: (payload: CreateEventPayload) => Promise<Event>;
    updateEventById: (id: string, payload: UpdateEventPayload) => Promise<Event>;
    clearError: () => void;
    reset: () => void;
};

const initialState: EventsState = {
    events: [],
    nextCursor: null,
    hasMore: true,
    isInitialLoading: false,
    isLoadingMore: false,
    deletingEventId: null,
    error: null,
};

let isFetching = false;

export const useEvents = create<EventsState & EventsActions>()(
    immer((set, get) => {
        async function loadEventsPage(cursor?: string) {
            if (isFetching) {
                return;
            }

            isFetching = true;

            const isFirstPage = cursor === undefined;

            set((state) => {
                state.error = null;
                if (isFirstPage) {
                    state.isInitialLoading = true;
                } else {
                    state.isLoadingMore = true;
                }
            });

            try {
                const response = await fetchEvents({
                    limit: PAGE_SIZE,
                    cursor,
                });

                set((state) => {
                    state.events = isFirstPage
                        ? response.events
                        : [...state.events, ...response.events];
                    state.nextCursor = response.nextCursor;
                    state.hasMore = response.hasMore;
                });
            } catch (err) {
                set((state) => {
                    state.error =
                        err instanceof Error ? err.message : "Unknown error";
                });
            } finally {
                isFetching = false;
                set((state) => {
                    state.isInitialLoading = false;
                    state.isLoadingMore = false;
                });
            }
        }

        return {
            ...initialState,

            loadInitial: () => loadEventsPage(),

            loadMore: () => {
                const { hasMore, isLoadingMore, isInitialLoading, nextCursor } =
                    get();

                if (
                    !hasMore ||
                    isLoadingMore ||
                    isInitialLoading ||
                    !nextCursor
                ) {
                    return Promise.resolve();
                }

                return loadEventsPage(nextCursor);
            },

            deleteEventById: async (id: string) => {
                set((state) => {
                    state.deletingEventId = id;
                });

                try {
                    await deleteEventApi(id);

                    set((state) => {
                        const remainingEvents = state.events.filter(
                            (event) => event.id !== id,
                        );

                        if (state.nextCursor === id) {
                            state.nextCursor =
                                remainingEvents.at(-1)?.id ?? null;
                        }

                        state.events = remainingEvents;
                    });
                } finally {
                    set((state) => {
                        state.deletingEventId = null;
                    });
                }
            },

            addEvent: async (payload: CreateEventPayload) => {
                const event = await createEventApi(payload);

                set((state) => {
                    state.events.unshift(event);
                });

                return event;
            },

            updateEventById: async (id: string, payload: UpdateEventPayload) => {
                const event = await updateEventApi(id, payload);

                set((state) => {
                    const index = state.events.findIndex(
                        (item) => item.id === event.id,
                    );

                    if (index !== -1) {
                        state.events[index] = event;
                    }
                });

                return event;
            },

            clearError: () => {
                set((state) => {
                    state.error = null;
                });
            },

            reset: () => {
                isFetching = false;
                set(initialState);
            },
        };
    }),
);
