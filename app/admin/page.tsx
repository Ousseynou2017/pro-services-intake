"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

type RequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  answers: Record<string, string>;
  status: "new" | "contacted" | "archived";
};

const STATUSES: RequestRow["status"][] = ["new", "contacted", "archived"];

const STATUS_STYLE: Record<RequestRow["status"], string> = {
  new: "border-accent/30 bg-accent-soft text-accent",
  contacted: "border-amber-300 bg-amber-50 text-amber-700",
  archived: "border-line bg-paper text-muted",
};

const supabase = createClient();

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center text-muted">
        Loading…
      </main>
    );
  }

  return user ? <Dashboard user={user} /> : <LoginForm />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setError("Incorrect email or password.");
      setBusy(false);
    }
    // On success the auth listener swaps in the dashboard.
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-serif text-3xl">Admin sign in</h1>
      <p className="mt-2 text-muted">Atlas Consulting request inbox.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-base outline-none focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-line bg-card px-3.5 py-2.5 text-base outline-none focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ user }: { user: User }) {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError("Could not load requests.");
    } else {
      setRows((data ?? []) as RequestRow[]);
      setLoadError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const diff =
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return newestFirst ? diff : -diff;
    });
    return copy;
  }, [rows, newestFirst]);

  async function updateStatus(id: string, status: RequestRow["status"]) {
    // Optimistic: reflect the change immediately, roll back if the write fails.
    const previous = rows;
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);
    if (error) {
      setRows(previous);
      setLoadError("Could not update that request. Please retry.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Requests</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewestFirst((v) => !v)}
            className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Date {newestFirst ? "↓ newest" : "↑ oldest"}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign out
          </button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-muted">Loading requests…</p>
      ) : sorted.length === 0 ? (
        <p className="mt-10 text-muted">No requests yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-line md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => (
                  <tr key={row.id} className="border-t border-line align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-muted">{row.email}</div>
                      {row.company && (
                        <div className="text-muted">{row.company}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{row.service}</td>
                    <td className="px-4 py-3">
                      <Answers answers={row.answers} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={row.status}
                        onChange={(s) => updateStatus(row.id, s)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-8 space-y-4 md:hidden">
            {sorted.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-line bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="text-sm text-muted">{row.email}</div>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted">
                    {formatDate(row.created_at)}
                  </span>
                </div>
                {row.company && (
                  <div className="mt-1 text-sm text-muted">{row.company}</div>
                )}
                <div className="mt-3 text-sm font-medium">{row.service}</div>
                <div className="mt-2">
                  <Answers answers={row.answers} />
                </div>
                <div className="mt-4">
                  <StatusSelect
                    value={row.status}
                    onChange={(s) => updateStatus(row.id, s)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function Answers({ answers }: { answers: Record<string, string> }) {
  const entries = Object.entries(answers ?? {});
  if (entries.length === 0) return <span className="text-muted">—</span>;
  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-accent">
        {entries.length} answer{entries.length > 1 ? "s" : ""}
      </summary>
      <dl className="mt-2 space-y-1.5">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs uppercase tracking-wide text-muted">
              {key}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: RequestRow["status"];
  onChange: (status: RequestRow["status"]) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as RequestRow["status"])}
      className={`rounded-full border px-3 py-1.5 text-sm capitalize outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${STATUS_STYLE[value]}`}
    >
      {STATUSES.map((status) => (
        <option key={status} value={status} className="bg-card text-ink">
          {status}
        </option>
      ))}
    </select>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
