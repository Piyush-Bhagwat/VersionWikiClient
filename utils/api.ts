import { InternalAxiosRequestConfig } from "axios";

import { default as axios } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const userStr: string | null = localStorage.getItem("user");

    if (!userStr) {
        return config;
    }

    const user = JSON.parse(userStr) as { token?: string };

    if (user.token) {
        config.headers.set("Authorization", `Bearer ${user.token}`);
    }

    return config;
});

export default api;
