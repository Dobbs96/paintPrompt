//API helper to connect frontend to backend
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// testing
export async function pingBackend(): Promise<string> {
    const res = await fetch(`${API_BASE}/api/ping`);
    if (!res.ok) throw new Error("Failed to connect");
    const data = await res.json();
    return data;
}
