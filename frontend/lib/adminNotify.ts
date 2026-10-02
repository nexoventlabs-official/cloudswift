"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type Conv = {
  _id: string;
  phone: string;
  name?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
};

const POLL_MS = 6000;
const MUTE_KEY = "cs_admin_sound_muted";

/**
 * Admin notifications: polls the CRM conversations endpoint and, when the
 * total UNREAD (inbound-only) count rises, plays a chime, raises a desktop
 * notification, and surfaces an in-app toast. unreadCount only increments on
 * inbound messages (see upsertConversation), so the admin's own replies and
 * opening a conversation never trigger a false alert.
 */
export function useAdminNotifications(enabled: boolean) {
  const [totalUnread, setTotalUnread] = useState(0);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const [muted, setMutedState] = useState(false);

  const prevTotalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore mute preference.
  useEffect(() => {
    try {
      const m = localStorage.getItem(MUTE_KEY) === "true";
      setMutedState(m);
      mutedRef.current = m;
    } catch {}
  }, []);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    mutedRef.current = v;
    try { localStorage.setItem(MUTE_KEY, String(v)); } catch {}
  }, []);

  // Prime an AudioContext on the first user gesture so the chime is allowed
  // to play later (browsers block audio started from a timer with no prior
  // interaction).
  useEffect(() => {
    if (!enabled) return;
    const prime = () => {
      if (!audioCtxRef.current) {
        try {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new Ctx();
        } catch {}
      }
      audioCtxRef.current?.resume?.().catch(() => {});
    };
    window.addEventListener("pointerdown", prime);
    window.addEventListener("keydown", prime);
    return () => {
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("keydown", prime);
    };
  }, [enabled]);

  // Ask for desktop-notification permission once.
  useEffect(() => {
    if (!enabled) return;
    try {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    } catch {}
  }, [enabled]);

  const playChime = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Two-tone "ding-dong" (A5 -> D6).
      [{ f: 880, t: 0 }, { f: 1174.66, t: 0.14 }].forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.35, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.22);
        osc.start(now + t);
        osc.stop(now + t + 0.25);
      });
    } catch {}
  }, []);

  const notify = useCallback(
    (conv: Conv | undefined, delta: number) => {
      const who = conv?.name || conv?.phone || "a contact";
      const title = delta > 1 ? `${delta} new messages` : "New WhatsApp message";
      const body = conv ? `${who}: ${conv.lastMessage || ""}`.slice(0, 120) : "You have new unread messages.";

      playChime();
      setToast({ title, body });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 6000);

      try {
        if ("Notification" in window && Notification.permission === "granted") {
          const n = new Notification(title, { body, tag: "cs-admin-crm" });
          n.onclick = () => {
            window.focus();
            if (conv?.phone) window.location.href = "/admin/crm";
            n.close();
          };
        }
      } catch {}
    },
    [playChime],
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const r = await adminApi.get("/crm/conversations?limit=100");
        if (cancelled) return;
        const convs: Conv[] = r.data || [];
        const total = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setTotalUnread(total);

        const prev = prevTotalRef.current;
        if (prev !== null && total > prev) {
          // Newest unread conversation drives the toast/desktop text.
          const newest = convs
            .filter((c) => (c.unreadCount || 0) > 0)
            .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())[0];
          notify(newest, total - prev);
        }
        prevTotalRef.current = total;
      } catch {
        // ignore transient poll errors
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled, notify]);

  // Reflect unread count in the browser tab title.
  useEffect(() => {
    if (!enabled) return;
    const base = "CloudSwift Admin";
    document.title = totalUnread > 0 ? `(${totalUnread}) ${base}` : base;
    return () => { document.title = base; };
  }, [enabled, totalUnread]);

  return { totalUnread, toast, muted, setMuted };
}
