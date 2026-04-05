import { getToken } from "./supabaseDirect";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const TIMEOUT_MS = 30_000;

export async function streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  // Read token directly from localStorage — avoids getSession() network hang
  const token = getToken();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Merge caller's signal with our timeout signal
  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ messages, systemPrompt }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`Chat-Fehler: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      full += text;
      onChunk(full);
    }

    return full;
  } finally {
    clearTimeout(timeoutId);
  }
}
