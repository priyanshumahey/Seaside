"use client";

import { useState, KeyboardEvent } from "react";
import { Plus, X, Link2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LinkedInInputProps {
  onScrape: (urls: string[]) => void;
  isLoading: boolean;
}

function isValidLinkedInUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.includes("linkedin.com") && u.pathname.includes("/in/");
  } catch {
    return false;
  }
}

export function LinkedInInput({ onScrape, isLoading }: LinkedInInputProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  function addUrl(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (!isValidLinkedInUrl(trimmed)) {
      setInputError("Must be a valid LinkedIn /in/ URL");
      return;
    }
    if (urls.includes(trimmed)) {
      setInputError("Already added");
      return;
    }

    setUrls((prev) => [...prev, trimmed]);
    setInputValue("");
    setInputError("");
  }

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addUrl(inputValue);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    const lines = text.split(/[\n,\s]+/).filter(Boolean);
    if (lines.length > 1) {
      e.preventDefault();
      const valid = lines.filter(isValidLinkedInUrl);
      const dupes = valid.filter((u) => urls.includes(u));
      const newUrls = valid.filter((u) => !urls.includes(u));
      setUrls((prev) => [...prev, ...newUrls]);
      if (dupes.length > 0) setInputError(`${dupes.length} duplicate(s) skipped`);
      else setInputError("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="https://linkedin.com/in/username"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError("");
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className={cn(
                "pl-9 font-mono text-sm",
                inputError && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => addUrl(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {inputError && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            {inputError}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Press Enter or paste multiple URLs (comma or newline separated)
        </p>
      </div>

      {urls.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {urls.length} URL{urls.length !== 1 ? "s" : ""} queued
          </p>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {urls.map((url) => (
              <div
                key={url}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-muted/50 border border-border/50 group"
              >
                <span className="font-mono text-xs text-foreground/80 truncate">{url}</span>
                <button
                  onClick={() => removeUrl(url)}
                  disabled={isLoading}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                  aria-label="Remove URL"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() => onScrape(urls)}
        disabled={urls.length === 0 || isLoading}
        className="w-full gap-2"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scraping Profiles…
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Scrape {urls.length > 0 ? `${urls.length} Profile${urls.length !== 1 ? "s" : ""}` : "Profiles"}
          </>
        )}
      </Button>

      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() => {
            setUrls([
              "https://linkedin.com/in/alex-chen-swe",
              "https://linkedin.com/in/priya-sharma-pm",
              "https://linkedin.com/in/marcus-johnson-ux",
            ]);
            setInputError("");
          }}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          Load mock URLs
        </button>
      )}
    </div>
  );
}
