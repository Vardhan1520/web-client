/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Terminal, RefreshCcw, CheckCircle2, AlertCircle, Database, Lock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AutomationStatus {
  status: string;
  logs: string[];
  sql_query: string;
}

export default function App() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/automation-status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error("Failed to fetch automation status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-[#30363d] pb-8">
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-indigo-400"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="text-xs font-bold tracking-widest uppercase">System Automation Active</span>
            </motion.div>
            <div className="px-3 py-1 bg-[#238636]/20 text-[#238636] border border-[#238636]/30 rounded-full text-xs font-bold">
              RUNNING_ON_STARTUP
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Backend Automation Service</h1>
          <p className="text-[#8b949e]">Fulfilling automation requirements: SQL Query Submission, JWT signing, and Webhook integration.</p>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Database size={18}/>, label: "SQL Logic", status: "OK" },
            { icon: <Lock size={18}/>, label: "JWT Auth", status: "OK" },
            { icon: <Globe size={18}/>, label: "Webhook", status: status?.logs.some(l => l.includes('Webhook response: 200')) ? "SUCCESS" : "WAITING" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3"
            >
              <div className="text-indigo-400">{item.icon}</div>
              <div className="flex-1">
                <div className="text-xs text-[#8b949e]">{item.label}</div>
                <div className="text-sm font-bold text-white tracking-wide">{item.status}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SQL Preview */}
        <section className="mb-8 p-6 bg-[#010409] border border-[#30363d] rounded-xl">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8b949e] mb-4">
            <Database size={14}/> Submitting SQL Logic
          </h2>
          <pre className="text-sm text-indigo-300 overflow-x-auto">
            {status?.sql_query || "Loading query..."}
          </pre>
        </section>

        {/* Automation Terminal Logs */}
        <section className="bg-[#010409] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
              <Terminal size={14}/> Execution Logs
            </h2>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>
          <div className="p-6 font-mono text-xs overflow-y-auto max-h-[400px] space-y-2">
            {status?.logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-[#8b949e] select-none">[{i+1}]</span>
                <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('Webhook') ? 'text-green-400' : ''}>
                  {log}
                </span>
                {log.includes('SUCCESS') && <CheckCircle2 size={12} className="inline text-green-400 ml-1"/>}
                {log.includes('ERROR') && <AlertCircle size={12} className="inline text-red-400 ml-1"/>}
              </motion.div>
            ))}
            {!status?.logs.length && <div className="text-[#484f58]">Initializing automation terminal...</div>}
          </div>
        </section>

        <footer className="mt-8 text-center text-[#484f58] text-[10px] uppercase tracking-[0.2em]">
          Backend Isolation Mode &bull; Production Standard Security Auth
        </footer>
      </div>
    </div>
  );
}
