"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Info, Loader2, Play, Database } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";
import ResultsTable from "@/components/ResultsTable";
import { useAuth } from "@/context/AuthContext";

interface DashboardProps {
    onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
    const [file, setFile] = useState<File | null>(null);
    const [support, setSupport] = useState(0.05);
    const [confidence, setConfidence] = useState(0.3);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError("");
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please upload a CSV file first.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("support", support.toString());
        formData.append("confidence", confidence.toString());

        try {
            const response = await axios.post('/api/analyze', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (response.data.results) {
                setResults(response.data.results);
            } else if (response.data.message) {
                setError(response.data.message);
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Failed to analyze data. Ensure backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl space-y-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Analysis Dashboard</h2>
                        <p className="text-zinc-400 mt-1">Configure parameters and upload transaction data.</p>
                    </div>
                    <button onClick={onBack} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        Back to Home
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Controls */}
                    <div className="md:col-span-1 space-y-6">
                        {/* File Upload */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "glass-panel relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-dashed border-2 border-zinc-700 p-4 transition-all hover:bg-zinc-900/50 hover:border-accent/50",
                                file ? "border-primary/50 bg-primary/5" : ""
                            )}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                            {file ? (
                                <div className="flex flex-col items-center text-primary animate-in fade-in zoom-in duration-300">
                                    <FileText className="h-10 w-10 mb-2" />
                                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500 hover:text-zinc-300">
                                    <Upload className="h-10 w-10 mb-2" />
                                    <span className="text-sm font-medium">Click or Drag CSV here</span>
                                </div>
                            )}
                        </div>

                        {/* Parameters */}
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Min Support</label>
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-zinc-500 hover:text-accent cursor-help" />
                                        <span className="absolute right-0 top-6 w-48 rounded bg-zinc-900 p-2 text-xs text-zinc-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-border">
                                            The minimum frequency threshold for an item to be considered significant (Range: 0.0 - 1.0).
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="range" min="0.01" max="1.0" step="0.01" value={support} onChange={e => setSupport(parseFloat(e.target.value))}
                                    className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>0%</span>
                                    <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">{Math.round(support * 100)}%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Min Confidence</label>
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-zinc-500 hover:text-accent cursor-help" />
                                        <span className="absolute right-0 top-6 w-48 rounded bg-zinc-900 p-2 text-xs text-zinc-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-border">
                                            The minimum probability that a rule is valid (Range: 0.0 - 1.0).
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="range" min="0.01" max="1.0" step="0.01" value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))}
                                    className="w-full accent-accent h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>0%</span>
                                    <span className="text-accent font-mono bg-accent/10 text-accent-foreground px-2 py-0.5 rounded">{Math.round(confidence * 100)}%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-violet-600 hover:to-violet-500 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
                                {loading ? "Analyzing..." : "Run Analysis"}
                            </button>
                            {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="md:col-span-2">
                        <div className="glass-panel min-h-[500px] rounded-xl overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <span className="font-semibold text-zinc-100">Association Rules</span>
                                <span className="text-xs text-zinc-500">{results.length} rules found</span>
                            </div>

                            <div className="flex-1 overflow-auto p-0">
                                {loading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p>Processing data...</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <ResultsTable data={results} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                        <Database className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No results yet. Upload a file and run analysis.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
