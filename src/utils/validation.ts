import type { CreateEventPayload } from "@/types/event";

export type ValidationResult<T extends string> = {
    isValid: boolean;
    errors: Partial<Record<T, string>>;
};

export type EventFormField = "name" | "location" | "country" | "capacity";

export type EventFormInput = {
    name: string;
    location: string;
    country: string;
    capacity: string;
};

export type LoginFormValues = {
    email: string;
    password: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
    const trimmed = email.trim();

    if (!trimmed) {
        return "Email is required";
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
        return "Invalid email address";
    }

    return undefined;
}

export function validatePassword(password: string): string | undefined {
    if (!password) {
        return "Password is required";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain a lowercase letter";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain an uppercase letter";
    }

    if (!/\d/.test(password)) {
        return "Password must contain a number";
    }

    return undefined;
}

export function validateLoginForm(
    email: string,
    password: string,
): ValidationResult<"email" | "password"> & {
    values?: LoginFormValues;
} {
    const errors: Partial<Record<"email" | "password", string>> = {};
    const trimmedEmail = email.trim();

    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
        errors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        errors.password = passwordError;
    }

    if (Object.keys(errors).length > 0) {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors,
        values: {
            email: trimmedEmail,
            password,
        },
    };
}

function parseCapacity(capacity: string): number | undefined {
    const trimmed = capacity.trim();

    if (!trimmed) {
        return undefined;
    }

    const parsed = Number(trimmed);

    if (!Number.isFinite(parsed)) {
        return Number.NaN;
    }

    return parsed;
}

export function validateEventForm(input: EventFormInput): ValidationResult<EventFormField> & {
    values?: CreateEventPayload;
} {
    const errors: Partial<Record<EventFormField, string>> = {};

    const name = input.name.trim();
    if (!name) {
        errors.name = "Name is required";
    }

    const location = input.location.trim();
    if (!location) {
        errors.location = "Location is required";
    } else if (location.length > 100) {
        errors.location = "Location must be at most 100 characters";
    }

    const country = input.country.trim();
    const capacity = parseCapacity(input.capacity);

    if (capacity !== undefined && Number.isNaN(capacity)) {
        errors.capacity = "Capacity must be a valid number";
    } else if (capacity !== undefined && capacity <= 0) {
        errors.capacity = "Capacity must be a positive number";
    }

    if (Object.keys(errors).length > 0) {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors,
        values: {
            name,
            location,
            country: country || undefined,
            capacity,
        },
    };
}
