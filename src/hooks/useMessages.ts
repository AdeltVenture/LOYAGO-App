import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return; }

      const { data } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (data) setMessages((data as DbMessage[]).map(toMessage));
      setLoading(false);
    });
  }, []);

   async function saveMessage(role: "user" | "assistant", content: string) {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMsg: ChatMessage = { id: tempId, role, content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const tempMsg: ChatMessage = { id: tempId, role, content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("messages")
      .insert({ user_id: session.user.id, role, content })
      .select("id, role, content, created_at")
      .single();

    if (data) {
      setMessages((prev) => prev.map((m) => m.id === tempId ? toMessage(data as DbMessage) : m));
    }
  }

  return { messages, loading, saveMessage };
}

function toMessage(r: DbMessage): ChatMessage {
  return { id: r.id, role: r.role as "user" | "assistant", content: r.content, createdAt: r.created_at };
}
