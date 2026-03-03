"use client";

import { useState } from "react";
import { Loader2, Search, Zap, AlertCircle } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one field is provided
    if (!email && !phoneNumber) {
      setError("Please provide either an email or a phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    const payload: any = {};
    if (email.trim()) payload.email = email.trim();
    // Use the string value for phone numbers to support international and formatted numbers
    if (phoneNumber.trim()) payload.phoneNumber = phoneNumber.trim();

    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong while identifying the contact.");
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

        {/* Left Side - Input Form */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-200/50 px-4 text-sm font-medium dark:bg-zinc-800/50">
              <Zap className="mr-2 h-4 w-4 text-orange-500" />
              <span>Identity Reconciliation</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl text-black dark:text-white">
              Bite Speed
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
              Enter an email or phone number to find and consolidate the customer's identity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="doc@hillvalley.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-white transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none block">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                placeholder="1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-white transition-all duration-200 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 mt-4 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Identifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Identify Contact
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400 max-w-sm border border-red-200 dark:border-red-900/50 shadow-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Side - Response JSON */}
        <div className="flex flex-col h-full min-h-[400px]">
          <div className="flex-1 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#0a0a0a] overflow-hidden flex flex-col">
            <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <p className="ml-4 text-xs font-mono text-zinc-500">Response Payload</p>
            </div>

            <div className="flex-1 p-0 overflow-auto relative">
              {response ? (
                <pre className="p-6 text-sm font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto min-h-full">
                  <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-mono text-sm">
                  Awaiting request...
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
