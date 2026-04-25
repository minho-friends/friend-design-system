"use client";

import { ExplorerRenderer } from "@/lib/render/renderer";
import { useChat } from "@ai-sdk/react";
import { SPEC_DATA_PART, SPEC_DATA_PART_TYPE, type SpecDataPart } from "@json-render/core";
import { useJsonRenderMessage } from "@json-render/react";
import { code } from "@streamdown/code";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowDown, ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

type AppDataParts = { [SPEC_DATA_PART]: SpecDataPart };
type AppMessage = UIMessage<unknown, AppDataParts>;

const transport = new DefaultChatTransport<AppMessage>({ api: "/api/generate" });

const SUGGESTIONS = [
  {
    label: "Service dashboard",
    prompt:
      "Show a dashboard with 4 microservices: api-gateway (running), auth-service (running), worker (stopped), scheduler (completed)",
  },
  {
    label: "Resource overview",
    prompt:
      "Create a system resource overview with CPU at 72%, memory at 4.2GB/8GB, 3 running processes with their metrics",
  },
  {
    label: "Deployment status",
    prompt: "Show a deployment pipeline: build (completed), test (completed), staging (running), production (stopped)",
  },
  {
    label: "Process monitor",
    prompt:
      "Build a process monitoring view for a web app: nginx, node server, redis, postgres — all running with realistic metrics",
  },
];

function MessageBubble({
  message,
  isLast,
  isStreaming,
}: {
  message: AppMessage;
  isLast: boolean;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const { spec, text, hasSpec } = useJsonRenderMessage(message.parts);

  // Build ordered segments from parts
  const segments: Array<
    { kind: "text"; text: string } | { kind: "spec" }
  > = [];

  let specInserted = false;

  for (const part of message.parts) {
    if (part.type === "text") {
      if (!part.text.trim()) continue;
      const last = segments[segments.length - 1];
      if (last?.kind === "text") {
        last.text += part.text;
      } else {
        segments.push({ kind: "text", text: part.text });
      }
    } else if (part.type === SPEC_DATA_PART_TYPE && !specInserted) {
      segments.push({ kind: "spec" });
      specInserted = true;
    }
  }

  const hasAnything = segments.length > 0 || hasSpec;
  const showLoader = isLast && isStreaming && message.role === "assistant" && !hasAnything;

  if (isUser) {
    return (
      <div className="flex justify-end">
        {text && (
          <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-primary text-primary-foreground rounded-tr-md">
            {text}
          </div>
        )}
      </div>
    );
  }

  const showSpecAtEnd = hasSpec && !specInserted;

  return (
    <div className="w-full flex flex-col gap-3">
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          const isLastSegment = i === segments.length - 1;
          return (
            <div
              key={`text-${i}`}
              className="text-sm leading-relaxed [&_p+p]:mt-3 [&_ul]:mt-2 [&_ol]:mt-2 [&_pre]:mt-2"
            >
              <Streamdown
                plugins={{ code }}
                animated={isLast && isStreaming && isLastSegment}
              >
                {seg.text}
              </Streamdown>
            </div>
          );
        }
        if (seg.kind === "spec") {
          if (!hasSpec) return null;
          return (
            <div key="spec" className="w-full">
              <ExplorerRenderer spec={spec} loading={isLast && isStreaming} />
            </div>
          );
        }
        return null;
      })}

      {showLoader && (
        <div className="text-sm text-muted-foreground animate-shimmer">
          Thinking...
        </div>
      )}

      {showSpecAtEnd && (
        <div className="w-full">
          <ExplorerRenderer spec={spec} loading={isLast && isStreaming} />
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isStickToBottom = useRef(true);
  const isAutoScrolling = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const demoTransport = new DefaultChatTransport<AppMessage>({ api: "/api/generate/demo" });
  const isDemo = typeof window !== "undefined" && window.location.hash === "#demo";
  const activeTransport = isDemo ? demoTransport : transport;

  const { messages, sendMessage, setMessages, status, error } = useChat<AppMessage>({ transport: activeTransport });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (isDemo && messages.length === 0) {
      sendMessage({
        text:
          "Build a process monitoring view for a web app: nginx, node server, redis, postgres — all running with realistic metrics",
      });
    }
  }, [isDemo, messages.length, sendMessage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const THRESHOLD = 80;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollTop + clientHeight >= scrollHeight - THRESHOLD;
      if (isAutoScrolling.current) {
        if (atBottom) isAutoScrolling.current = false;
        return;
      }
      isStickToBottom.current = atBottom;
      setShowScrollButton(!atBottom);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isStickToBottom.current) return;
    isAutoScrolling.current = true;
    container.scrollTop = container.scrollHeight;
    requestAnimationFrame(() => {
      isAutoScrolling.current = false;
    });
  }, [messages, isStreaming]);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isStickToBottom.current = true;
    setShowScrollButton(false);
    isAutoScrolling.current = true;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(
    async (text?: string) => {
      const message = text || input;
      if (!message.trim() || isStreaming) return;
      setInput("");
      await sendMessage({ text: message.trim() });
    },
    [input, isStreaming, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }, [setMessages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Demo
          </a>
          <span className="text-muted-foreground/40">|</span>
          <h1 className="text-lg font-semibold">Friend Tools — UI Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Messages area */}
      <main ref={scrollContainerRef} className="flex-1 overflow-auto">
        {isEmpty
          ? (
            <div className="h-full flex flex-col items-center justify-center px-6 py-12">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Generate a process dashboard
                  </h2>
                  <p className="text-muted-foreground">
                    Describe the services or processes you want to visualize — the AI will build a dashboard using
                    Friend Tools components.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSubmit(s.prompt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
          : (
            <div className="max-w-4xl mx-auto px-10 py-6 space-y-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                  isStreaming={isStreaming}
                />
              ))}
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error.message}
                </div>
              )}
            </div>
          )}
      </main>

      {/* Input bar */}
      <div className="px-6 pb-3 flex-shrink-0 bg-background relative">
        {showScrollButton && !isEmpty && (
          <button
            onClick={scrollToBottom}
            className="absolute left-1/2 -translate-x-1/2 -top-10 z-10 h-8 w-8 rounded-full border border-border bg-background text-muted-foreground shadow-md flex items-center justify-center hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
        <div className="max-w-4xl mx-auto relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isEmpty
              ? "e.g., Show a dashboard with running api-gateway, auth-service, and a stopped worker..."
              : "Ask a follow-up..."}
            rows={2}
            className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            autoFocus
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isStreaming}
            className="absolute right-3 bottom-3 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
