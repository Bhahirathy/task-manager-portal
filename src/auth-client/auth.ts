import { storage } from "./storage";

export const authClient = {
    isAuthenticated() {
        return !!storage.getToken();
    },

    logout() {
        storage.removeToken();
    },
};