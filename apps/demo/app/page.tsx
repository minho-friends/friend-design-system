"use client";
import dynamic from "next/dynamic";
import { demoSpec } from "../lib/spec";

const DemoRenderer = dynamic(() => import("../components/DemoRenderer"), { ssr: false });

export default function Page() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#F9FAFB", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
        <h1>Friend Tools — json-render Demo</h1>
        <a
          href="/chat" // FIXME: if no API KEY is set, change this to /chat#demo
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            background: "#111827",
            color: "white",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ✨ UI Chat →
        </a>
      </div>
      <hr style={{ marginTop: "20px" }} />
      <DemoRenderer spec={demoSpec} />
    </main>
  );
}
