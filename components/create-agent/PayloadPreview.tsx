"use client";

import { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { CreateAgentPayload } from "@/lib/types";

interface PayloadPreviewProps {
  payload: CreateAgentPayload | null;
}

export function PayloadPreview({ payload }: PayloadPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!payload) return;
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!payload) return null;

  return (
    <div className="rounded-lg border bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Code2 className="h-3.5 w-3.5" />
          <span>POST /agents/create — payload preview</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs text-zinc-200 overflow-x-auto leading-relaxed">
        <code>{JSON.stringify(payload, null, 2)}</code>
      </pre>
    </div>
  );
}
