export type Event = {
    id: string;
    name: string;
    location: string;
    country?: string;
    capacity?: number;
};

export type FetchEventsParams = {
    /** Omitted on the first request; pass `nextCursor` from the previous response afterwards. */
    cursor?: string;
    limit?: number;
};

export type FetchEventsResponse = {
    events: Event[];
    limit: number;
    /** Pass as `cursor` on the next request. Null when there are no more results. */
    nextCursor: string | null;
    hasMore: boolean;
};

export type CreateEventPayload = {
    name: string;
    location: string;
    country?: string;
    capacity?: number;
};

export type UpdateEventPayload = CreateEventPayload;
