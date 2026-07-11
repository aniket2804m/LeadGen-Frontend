import React, { useState } from "react";
import { ScoredLead, Meeting } from "../../types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MeetingsTabProps {
  lead: ScoredLead;
  meetings: Meeting[];
  onBookMeeting: (meeting: Omit<Meeting, "id">) => void;
  onDeleteMeeting: (id: string) => void;
}

export default function MeetingsTab({
  lead,
  meetings,
  onBookMeeting,
  onDeleteMeeting,
}: MeetingsTabProps) {
  const [mTitle, setMTitle] = useState("AI Audit Discovery Call");
  const [mDate, setMDate] = useState("");
  const [mTime, setMTime] = useState("");
  const [mNotes, setMNotes] = useState("");

  const handleBookMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle || !mDate || !mTime) return;

    onBookMeeting({
      leadId: lead.id,
      leadName: lead.name,
      title: mTitle,
      date: mDate,
      time: mTime,
      notes: mNotes
    });

    setMTitle("AI Audit Discovery Call");
    setMDate("");
    setMTime("");
    setMNotes("");
  };

  const leadMeetings = meetings.filter((m) => m.leadId === lead.id);

  return (
    <div className="space-y-6">
      
      {/* Call scheduler form */}
      <form onSubmit={handleBookMeetingSubmit} className="glass p-4 border border-zinc-800 space-y-4 text-xs max-w-xl bg-black/40">
        <h4 className="font-cinzel text-[11px] font-bold text-white uppercase tracking-wider">Schedule Client Callback</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="call-title" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Call Topic</Label>
            <Input
              id="call-title"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              required
              className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="call-date" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Date</Label>
            <Input
              id="call-date"
              type="date"
              value={mDate}
              onChange={(e) => setMDate(e.target.value)}
              required
              className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="call-time" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Time</Label>
            <Input
              id="call-time"
              type="time"
              value={mTime}
              onChange={(e) => setMTime(e.target.value)}
              required
              className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs h-9"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <Label htmlFor="call-notes" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Agenda details</Label>
            <textarea
              id="call-notes"
              value={mNotes}
              onChange={(e) => setMNotes(e.target.value)}
              placeholder="Add brief details about the proposal or client expectations..."
              rows={2}
              className="w-full bg-black border border-zinc-850 text-white p-2.5 text-xs outline-none rounded-none focus:border-[#C9A84C]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            className="bg-[#C9A84C] text-black font-semibold text-[10px] rounded-none px-5 py-2 h-auto"
          >
            Schedule call
          </Button>
        </div>
      </form>

      {/* Call History */}
      <div className="space-y-3 text-left font-sans">
        <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Scheduled Calls for this Lead</h4>
        {leadMeetings.map((m) => (
          <div key={m.id} className="bg-black p-4 border border-zinc-850 flex justify-between items-center gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-white font-bold block">{m.title}</span>
              <span className="text-zinc-500 block">📅 {new Date(m.date).toLocaleDateString()} at ⏰ {m.time}</span>
              {m.notes && <span className="text-zinc-650 block text-[10px] italic">"{m.notes}"</span>}
            </div>
            <button
              onClick={() => onDeleteMeeting(m.id)}
              className="p-1 text-zinc-600 hover:text-red-500"
              title="Cancel call"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {leadMeetings.length === 0 && (
          <p className="text-zinc-500 italic text-center py-4">No meetings booked for this prospect.</p>
        )}
      </div>

    </div>
  );
}
