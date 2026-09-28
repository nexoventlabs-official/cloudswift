"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { answerCloudSwift, type ChatMessage } from "@/lib/ai";
import styles from "./AIAssistant.module.css";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — ask CloudSwift AI about Azure, Microsoft 365, migrations, AI services, or how to contact us.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const reply: ChatMessage = {
      role: "assistant",
      content: answerCloudSwift(text),
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  return (
    <div className={styles.root}>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className={styles.header}>
              <span className={styles.title}>Ask CloudSwift AI</span>
              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                close
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div
                  key={`${i}-${m.role}`}
                  className={
                    m.role === "user" ? styles.userBubble : styles.botBubble
                  }
                >
                  {m.content}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CloudSwift AI anything…"
                aria-label="Message CloudSwift AI"
              />
              <button type="submit" className={styles.send}>
                send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open CloudSwift AI"
      >
        AI
      </button>
    </div>
  );
}
