const TOKEN_KEY = "accessToken";

export const storage = {
    getToken() {
        if (typeof window === "undefined") return null;

        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },
};