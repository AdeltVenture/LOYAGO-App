import { useEffect, useState } from "react";
import { getToken, getUserId, restSelect } from "../lib/supabaseDirect";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface DbMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    restSelect<DbMessage>("messages", { user_id: userId }, "created_at.asc", 100)
      .then((data) => {
        if (cancelled) return;
        setMessages(data.map(toMessage));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  async function saveMessage(role: "user" | "assistant", content: string) {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg: ChatMessage = { id: tempId, role, content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);

    const userId = getUserId();
    if (!userId) return;

    // Insert via REST and fetch back the created row
    const token = getToken();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({ user_id: userId, role, content }),
    });

    if (res.ok) {
      const rows: DbMessage[] = await res.json();
      const saved = rows[0];
      if (saved) {
        setMessages((prev) => prev.map((m) => m.id === tempId ? toMessage(saved) : m));
      }
    }
  }

  return { messages, loading, saveMessage };
}

function toMessage(r: DbMessage): ChatMessage {
  return { id: r.id, role: r.role as "user" | "assistant", content: r.content, createdAt: r.created_at };
}
