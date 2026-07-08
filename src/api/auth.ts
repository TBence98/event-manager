export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

type LoginResponse = {
    token: string;
};

export async function login(
    email: string,
    password: string,
): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === "test@gmail.com" && password === "Test123") {
        return { token: "mock-token-abc123" };
    }

    throw new AuthError("Wrong email or password");
}
