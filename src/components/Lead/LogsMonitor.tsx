import { useEffect, useRef } from "react";
import { StatusLog } from "./types";

interface LogsMonitorProps {
  logs: StatusLog[];
}

export default function LogsMonitor({ logs }: LogsMonitorProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="glass border border-[#C9A84C]/20 p-5 space-y-3 shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#C9A84C]/15 pb-2">
        <span className="font-cinzel text-xs text-white uppercase tracking-wider font-semibold">
          OS Engine Status Monitor
        </span>
        <span className="font-mono text-[9px] text-[#F5F0E8]/35">console.exe</span>
      </div>
      <div className="h-44 overflow-y-auto bg-black p-4 border border-[#C9A84C]/10 font-mono text-[11px] space-y-1.5 scrollbar-none rounded-none text-left">
        {logs.map((log, i) => {
          let colorClass = "text-[#F5F0E8]/70";
          if (log.type === "success") colorClass = "text-[#C9A84C] font-semibold";
          if (log.type === "warning") colorClass = "text-[#F5C518]";
          if (log.type === "error") colorClass = "text-red-500";
          if (log.type === "action") colorClass = "text-sky-400";
          return (
            <div key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#F5F0E8]/30 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={colorClass}>{log.text}</span>
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
