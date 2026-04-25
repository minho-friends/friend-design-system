import { pipeJsonRender } from "@json-render/core";
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessageChunk } from "ai";

const SUMMARY = "Here's a compact 2x2 grid showing each service as a ProcessCard with its own live metrics.";

const PATCHES = [
  { op: "add", path: "/root", value: "root" },
  {
    op: "add",
    path: "/elements/root",
    value: {
      type: "Stack",
      props: { direction: "vertical", gap: "md" },
      children: ["h1", "grid"],
    },
  },
  {
    op: "add",
    path: "/elements/h1",
    value: {
      type: "Heading",
      props: { value: "Web App Process Monitoring", level: 2 },
    },
  },
  {
    op: "add",
    path: "/elements/grid",
    value: {
      type: "Grid",
      props: { columns: 2, gap: "md" },
      children: ["pc_nginx", "pc_node", "pc_redis", "pc_pg"],
    },
  },
  {
    op: "add",
    path: "/elements/pc_nginx",
    value: {
      type: "ProcessCard",
      props: {
        name: "nginx",
        status: "running",
        open: true,
        metrics: { age: 1200, cpu: 5, mem: 10 },
      },
    },
  },
  {
    op: "add",
    path: "/elements/pc_node",
    value: {
      type: "ProcessCard",
      props: {
        name: "node server",
        status: "running",
        open: true,
        metrics: { age: 950, cpu: 12, mem: 15 },
      },
    },
  },
  {
    op: "add",
    path: "/elements/pc_redis",
    value: {
      type: "ProcessCard",
      props: {
        name: "redis",
        status: "running",
        open: true,
        metrics: { age: 1800, cpu: 2, mem: 8 },
      },
    },
  },
  {
    op: "add",
    path: "/elements/pc_pg",
    value: {
      type: "ProcessCard",
      props: {
        name: "postgres",
        status: "running",
        open: true,
        metrics: { age: 2000, cpu: 8, mem: 20 },
      },
    },
  },
];

function createDemoTextStream() {
  const payload = `${SUMMARY}\n\n\`\`\`spec\n${PATCHES.map((patch) => JSON.stringify(patch)).join("\n")}\n\`\`\`\n`;

  return new ReadableStream<UIMessageChunk>({
    start(controller) {
      controller.enqueue({ type: "text-start", id: "demo-text" });
      controller.enqueue({
        type: "text-delta",
        id: "demo-text",
        delta: payload,
      });
      controller.enqueue({ type: "text-end", id: "demo-text" });
      controller.close();
    },
  });
}

export async function POST() {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.merge(pipeJsonRender(createDemoTextStream() as ReadableStream<any>));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
