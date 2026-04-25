import { ProcessCardReact } from "@/components/ui/ProcessCardReact";

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">shadcn Registry Test</h1>
        <p className="text-sm text-slate-600">
          This app is the integration target for local registry installs from
          <code className="mx-1 rounded bg-slate-200 px-1 py-0.5">shadcn-registry/public/r</code>.
        </p>
      </header>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium">Installed from local registry</h2>
        <p className="mt-2 text-sm text-slate-700">
          This <code className="rounded bg-slate-200 px-1 py-0.5">ProcessCardReact</code> file was added from{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5">
            ../derives/shadcn-registry/public/r/process-card.json
          </code>
          via the shadcn CLI.
        </p>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <ProcessCardReact
          name="registry-worker"
          status="running"
          open
          metrics={{ age: 640, cpu: 14, mem: 96 }}
          actions={[
            { type: "start", onClick: () => {}, disabled: true },
            { type: "stop", onClick: () => {}, disabled: false },
          ]}
        />
      </section>
    </main>
  );
}

export default App;
