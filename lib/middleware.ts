import { verifyJWT, type AuthPayload } from "./auth";
import { cookies } from "next/headers";

export async function requireAuth(): Promise<AuthPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
        return null;
    }

    const payload = await verifyJWT(token);
    return payload;
}
