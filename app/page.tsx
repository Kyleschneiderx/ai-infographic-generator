"use client";

import { useState, useRef, useCallback } from "react";

type Step = "idle" | "scraping" | "insights" | "images" | "pdf" | "complete" | "error";

interface StepConfig {
  key: Step;
  label: string;
}

const STEPS: StepConfig[] = [
  { key: "scraping", label: "Extract" },
  { key: "insights", label: "Analyze" },
  { key: "images", label: "Illustrate" },
  { key: "pdf", label: "Compose" },
];

function stepIndex(step: Step): number {
  return STEPS.findIndex((s) => s.key === step);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async () => {
    if (!url.trim()) return;

    setStep("scraping");
    setMessage("Starting...");
    setError("");
    setPdfData(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));

          if (data.type === "progress") {
            const stepKey = data.step?.replace("_done", "") as Step;
            if (STEPS.some((s) => s.key === stepKey)) {
              setStep(stepKey);
            }
            setMessage(data.message);
          } else if (data.type === "complete") {
            setStep("complete");
            setPdfData(data.pdf);
            setPdfTitle(data.title);
            setMessage("");
          } else if (data.type === "error") {
            setStep("error");
            setError(data.message);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setStep("error");
        setError((err as Error).message || "Something went wrong");
      }
    }
  }, [url]);

  const downloadPdf = useCallback(() => {
    if (!pdfData) return;
    const blob = new Blob(
      [Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0))],
      { type: "application/pdf" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${pdfTitle || "infographic"}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pdfData, pdfTitle]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStep("idle");
    setMessage("");
    setError("");
    setPdfData(null);
    setPdfTitle("");
  }, []);

  const isGenerating = !["idle", "complete", "error"].includes(step);
  const currentStepIdx = stepIndex(step);

  return (
    <div className="noise-overlay min-h-screen flex flex-col">
      {/* Atmospheric background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px] animate-glow-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-500/[0.05] blur-[100px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-500/[0.04] blur-[80px] animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/70">
            infographic<span className="text-accent">gen</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        {/* Hero text */}
        <div className="text-center mb-12 max-w-2xl animate-float-up">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Blog to{" "}
            <span className="italic bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              infographic
            </span>
            <br />
            in one click
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-md mx-auto">
            Paste a URL. Get five AI-extracted insights with custom illustrations, delivered as a print-ready PDF.
          </p>
        </div>

        {/* Input card */}
        <div
          className="w-full max-w-xl animate-float-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-xl p-1.5 shadow-2xl shadow-purple-950/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

            <div className="relative flex items-center gap-2">
              <div className="pl-4 text-text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && generate()}
                placeholder="Paste a blog post URL..."
                disabled={isGenerating}
                className="flex-1 bg-transparent text-foreground placeholder:text-text-muted/50 text-base py-4 px-2 outline-none disabled:opacity-40"
              />
              {step === "idle" ? (
                <button
                  onClick={generate}
                  disabled={!url.trim()}
                  className="relative px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.97] cursor-pointer"
                >
                  Generate
                </button>
              ) : step === "complete" ? (
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-text-muted hover:text-foreground border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
                >
                  New
                </button>
              ) : step === "error" ? (
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-text-muted hover:text-foreground border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
                >
                  Retry
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-text-muted/60 hover:text-text-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress / Result area */}
        <div
          className="w-full max-w-xl mt-8 animate-float-up"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Step indicators */}
          {isGenerating && (
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-6">
                {STEPS.map((s, i) => {
                  const isActive = s.key === step;
                  const isDone = currentStepIdx > i;
                  return (
                    <div key={s.key} className="flex-1">
                      <div className="h-1 rounded-full overflow-hidden bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isDone
                              ? "w-full bg-purple-500"
                              : isActive
                                ? "w-1/2 bg-gradient-to-r from-purple-500 to-fuchsia-500 animate-shimmer"
                                : "w-0"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs mt-2 text-center transition-colors duration-300 ${
                          isActive
                            ? "text-accent"
                            : isDone
                              ? "text-foreground/50"
                              : "text-text-muted/30"
                        }`}
                      >
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="relative w-5 h-5 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
                </div>
                <p className="text-sm text-text-muted">{message}</p>
              </div>
            </div>
          )}

          {/* Completion state */}
          {step === "complete" && pdfData && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Ready
              </div>

              <h2
                className="text-2xl sm:text-3xl tracking-tight mb-3 text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pdfTitle}
              </h2>
              <p className="text-text-muted text-sm mb-8">
                5 insights with AI-generated illustrations
              </p>

              <button
                onClick={downloadPdf}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 active:scale-[0.97] cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-0.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>
          )}

          {/* Error state */}
          {step === "error" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-400 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-300">Generation failed</p>
                  <p className="text-sm text-red-400/70 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6">
        <p className="text-xs text-text-muted/40">
          Powered by Claude &middot; Kie.ai &middot; Puppeteer
        </p>
      </footer>
    </div>
  );
}
