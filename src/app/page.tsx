"use client";

import { useState } from "react";
import { Loader2, Search, Zap, CheckCircle2, AlertCircle, Fingerprint, Network } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !phoneNumber) {
      setError("Please provide either an email or a phone number to begin reconciliation.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    const payload: any = {};
    if (email.trim()) payload.email = email.trim();
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
    <div className="relative min-h-screen font-sans text-zinc-900 dark:text-zinc-50 overflow-hidden bg-black selection:bg-indigo-500/30">

      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black animate-gradient-xy"></div>
        {/* Decorative Floating Orbs */}
        <div className="absolute top-20 left-[20%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Side - Hero & Input Form */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left duration-1000">

            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-md">
                <Zap className="mr-2 h-4 w-4 text-indigo-400" />
                <span className="tracking-wide uppercase text-xs">Identity Reconciliation Engine</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm">
                Bite<span className="font-light">Speed</span>
              </h1>

              <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                Seamlessly track and consolidate your customer's scattered footprints across multiple interactions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md relative">
              <div className="glass-panel p-6 rounded-2xl space-y-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="space-y-2 relative z-10">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Network className="w-4 h-4 text-indigo-400" /> Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="doc@hillvalley.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-zinc-700/50 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <label htmlFor="phone" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-fuchsia-400" /> Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-zinc-700/50 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black disabled:pointer-events-none disabled:opacity-50 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Resolving Identity...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Identify Customer
                    </>
                  )}
                </span>
              </button>
            </form>

            {error && (
              <div className="flex items-center space-x-3 rounded-xl bg-red-950/40 p-4 text-sm text-red-200 border border-red-900/50 backdrop-blur-md animate-in slide-in-from-bottom-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Side - Response Terminal */}
          <div className="lg:col-span-7 h-[600px] flex flex-col animate-in fade-in slide-in-from-right duration-1000 delay-150">
            <div className="flex-1 rounded-2xl border border-zinc-800/80 bg-[#09090b]/80 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">

              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3 bg-white/5">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div className="ml-4 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
                    STATUS: {response ? "200 OK" : "IDLE"}
                  </div>
                </div>
                <div className="flex items-center text-xs font-mono text-zinc-500 hidden sm:flex">
                  <span className="text-zinc-600">~</span>
                  <span className="mx-1">/</span>
                  <span className="text-indigo-400">api</span>
                  <span className="mx-1">/</span>
                  <span className="text-fuchsia-400">identify</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-0 overflow-auto relative font-mono text-sm leading-relaxed custom-scrollbar">
                {response ? (
                  <div className="p-6 relative z-10 animate-in fade-in duration-500">
                    <div className="mb-4 flex items-center text-green-400 text-xs tracking-wider">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Payload Received
                    </div>
                    {/* Render customized JSON with syntax highlighting colors */}
                    <div className="text-zinc-300">
                      <span className="text-zinc-500">{"{"}</span>
                      <div className="pl-4 border-l border-zinc-800/50 my-1">
                        <span className="text-fuchsia-300">"contact"</span><span className="text-zinc-500">:</span> <span className="text-zinc-500">{"{"}</span>
                        <div className="pl-4 border-l border-zinc-800/50 my-1 space-y-2">
                          <div>
                            <span className="text-indigo-300">"primaryContatctId"</span><span className="text-zinc-500">:</span> <span className="text-yellow-300">{response.contact.primaryContatctId}</span><span className="text-zinc-500">,</span>
                          </div>
                          <div>
                            <span className="text-indigo-300">"emails"</span><span className="text-zinc-500">:</span> <span className="text-zinc-500">{"["}</span>
                            {response.contact.emails.map((email: string, i: number) => (
                              <span key={i}>
                                <span className="text-green-300">"{email}"</span>{i < response.contact.emails.length - 1 ? <span className="text-zinc-500">, </span> : ""}
                              </span>
                            ))}
                            <span className="text-zinc-500">{"]"},</span>
                          </div>
                          <div>
                            <span className="text-indigo-300">"phoneNumbers"</span><span className="text-zinc-500">:</span> <span className="text-zinc-500">{"["}</span>
                            {response.contact.phoneNumbers.map((phone: string, i: number) => (
                              <span key={i}>
                                <span className="text-green-300">"{phone}"</span>{i < response.contact.phoneNumbers.length - 1 ? <span className="text-zinc-500">, </span> : ""}
                              </span>
                            ))}
                            <span className="text-zinc-500">{"]"},</span>
                          </div>
                          <div>
                            <span className="text-indigo-300">"secondaryContactIds"</span><span className="text-zinc-500">:</span> <span className="text-zinc-500">{"["}</span>
                            {response.contact.secondaryContactIds.map((id: number, i: number) => (
                              <span key={i}>
                                <span className="text-yellow-300">{id}</span>{i < response.contact.secondaryContactIds.length - 1 ? <span className="text-zinc-500">, </span> : ""}
                              </span>
                            ))}
                            <span className="text-zinc-500">{"]"}</span>
                          </div>
                        </div>
                        <span className="text-zinc-500">{"}"}</span>
                      </div>
                      <span className="text-zinc-500">{"}"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                    <Network className="w-12 h-12 mb-4 opacity-20" />
                    <p className="tracking-widest uppercase text-xs">Awaiting Reconciliation Request...</p>
                    <div className="mt-4 flex space-x-1">
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}

                {/* Background grid pattern for terminal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
