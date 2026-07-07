import { MOCK_EVENTS } from "@/api/mock-events";
import type {
    Event,
    FetchEventsParams,
    FetchEventsResponse,
} from "@/types/event";

const MOCK_NETWORK_DELAY_MS = 600;
const DEFAULT_LIMIT = 10;

export class EventsApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EventsApiError";
    }
}

// In-memory store so later create/update/delete calls stay in sync with reads.
let eventsStore: Event[] = [...MOCK_EVENTS];

function simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
}

function normalizeFetchParams(params: FetchEventsParams = {}): {
    cursor: string | undefined;
    limit: number;
} {
    const cursor = params.cursor;
    const limit = params.limit ?? DEFAULT_LIMIT;

    if (cursor !== undefined && cursor.length === 0) {
        throw new EventsApiError("Cursor must be a non-empty string");
    }

    if (!Number.isInteger(limit) || limit < 1) {
        throw new EventsApiError("Limit must be a positive integer");
    }

    return { cursor, limit };
}

function getStartIndex(cursor: string | undefined): number {
    if (cursor === undefined) {
        return 0;
    }

    const cursorIndex = eventsStore.findIndex((event) => event.id === cursor);

    if (cursorIndex === -1) {
        throw new EventsApiError(`Invalid cursor: ${cursor}`);
    }

    return cursorIndex + 1;
}

/**
 * Mock REST endpoint: GET /events?limit={limit}&cursor={cursor}
 * Omit cursor on the first request; use nextCursor from the response for subsequent pages.
 */
export async function fetchEvents(
    params: FetchEventsParams = {},
): Promise<FetchEventsResponse> {
    const { cursor, limit } = normalizeFetchParams(params);

    console.log("[API] fetchEvents request", { cursor, limit });

    await simulateNetworkDelay();

    const startIndex = getStartIndex(cursor);
    const events = eventsStore.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + events.length < eventsStore.length;
    const nextCursor = hasMore ? (events.at(-1)?.id ?? null) : null;

    const response: FetchEventsResponse = {
        events,
        limit,
        nextCursor,
        hasMore,
    };

    console.log("[API] fetchEvents response", {
        limit: response.limit,
        nextCursor: response.nextCursor,
        hasMore: response.hasMore,
        returnedCount: response.events.length,
    });

    return response;
}

/**
 * Mock REST endpoint: DELETE /events/{id}
 */
export async function deleteEvent(id: string): Promise<void> {
    console.log("[API] deleteEvent request", { id });

    await simulateNetworkDelay();

    const eventIndex = eventsStore.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
        throw new EventsApiError(`Event not found: ${id}`);
    }

    eventsStore.splice(eventIndex, 1);

    console.log("[API] deleteEvent success", {
        id,
        remaining: eventsStore.length,
    });
}

/** Resets in-memory data to the original mock seed (useful during development). */
export function resetEventsStore(): void {
    eventsStore = [...MOCK_EVENTS];
    console.log("[API] events store reset", { total: eventsStore.length });
}
