import { motion } from "framer-motion";

interface Rule {
    antecedents: string[];
    consequents: string[];
    support: number; // 0.1234
    confidence: number; // 0.5678
    lift: number;
}

interface ResultsTableProps {
    data: Rule[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
    return (
        <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/50 text-zinc-400 font-medium sticky top-0 backdrop-blur-md">
                <tr>
                    <th className="px-6 py-3">Antecedents (If)</th>
                    <th className="px-6 py-3">Consequents (Then)</th>
                    <th className="px-6 py-3 text-right">Support</th>
                    <th className="px-6 py-3 text-right">Confidence</th>
                    <th className="px-6 py-3 text-right">Lift</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.map((rule, idx) => (
                    <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className="hover:bg-white/5 transition-colors group"
                    >
                        <td className="px-6 py-4 font-medium text-zinc-200">
                            <div className="flex flex-wrap gap-1">
                                {rule.antecedents.map((item, i) => (
                                    <span key={i} className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-zinc-700/50">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {rule.consequents.map((item, i) => (
                                    <span key={i} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary/20">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-zinc-400">
                            {(rule.support * 100).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                            <span className="font-semibold text-emerald-400">{(rule.confidence * 100).toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums font-mono text-zinc-300">
                            {rule.lift.toFixed(4)}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    );
}
