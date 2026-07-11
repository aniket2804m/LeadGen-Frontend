import React, { useState } from "react";
import { Meeting, ScoredLead } from "./types";
import { Calendar, Clock, User, Phone, Trash2, CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalendarBookingProps {
  meetings: Meeting[];
  crmLeads: ScoredLead[];
  onBookMeeting: (meeting: Omit<Meeting, "id">) => void;
  onDeleteMeeting: (id: string) => void;
}

export default React.memo(function CalendarBooking({
  meetings,
  crmLeads,
  onBookMeeting,
  onDeleteMeeting,
}: CalendarBookingProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !title || !date || !time) return;

    const lead = crmLeads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    onBookMeeting({
      leadId: lead.id,
      leadName: lead.name,
      title,
      date,
      time,
      notes
    });

    // Reset Form
    setSelectedLeadId("");
    setTitle("");
    setDate("");
    setTime("");
    setNotes("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-[#C9A84C]/15 pb-3">
        <h2 className="font-cinzel text-lg md:text-xl text-white uppercase tracking-wider font-semibold">
          Meeting Calendar & Scheduler
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-none px-4 py-2 h-auto"
        >
          <Plus className="w-4 h-4 mr-1" /> Schedule Meeting
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass p-5 border border-[#C9A84C]/25 space-y-4 max-w-xl animate-fadeIn">
          <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Book Client Call</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <Label className="text-[10px] uppercase text-[#F5F0E8]/60 font-semibold tracking-wider">Select CRM Prospect</Label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 text-[#F5F0E8] text-xs px-2.5 py-2 outline-none rounded-none cursor-pointer focus:border-[#C9A84C]"
              >
                <option value="">-- Choose Lead --</option>
                {crmLeads.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.status})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <Label htmlFor="meeting-title" className="text-[10px] uppercase text-[#F5F0E8]/60 font-semibold tracking-wider">Meeting Agenda / Title</Label>
              <Input
                id="meeting-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SEO Audit Review, Service Retainer Pitch"
                required
                className="bg-black border border-zinc-800 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meeting-date" className="text-[10px] uppercase text-[#F5F0E8]/60 font-semibold tracking-wider">Date</Label>
              <Input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-black border border-zinc-800 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meeting-time" className="text-[10px] uppercase text-[#F5F0E8]/60 font-semibold tracking-wider">Time</Label>
              <Input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="bg-black border border-zinc-800 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C]"
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <Label htmlFor="meeting-notes" className="text-[10px] uppercase text-[#F5F0E8]/60 font-semibold tracking-wider">Discussion Notes</Label>
              <textarea
                id="meeting-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add brief details about the proposal or client expectations..."
                rows={3}
                className="w-full bg-black border border-zinc-800 text-white p-2.5 text-xs outline-none rounded-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-none px-4 py-2 h-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs rounded-none px-5 py-2 h-auto"
            >
              Save Appointment
            </Button>
          </div>
        </form>
      )}

      {/* Booked meetings list */}
      <div className="space-y-4">
        <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#C9A84C]" /> Booked Appointments ({meetings.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="bg-card text-card-foreground border border-border rounded-none p-4 hover:border-[#C9A84C]/50 transition-colors flex flex-col justify-between min-w-0 w-full overflow-hidden">
              <div className="space-y-3 min-w-0">
                <div className="flex items-start justify-between gap-1.5 min-w-0">
                  <h4 className="font-cinzel text-xs font-bold text-card-foreground uppercase tracking-wider truncate flex-1 text-left">
                    {meeting.title}
                  </h4>
                  <button
                    onClick={() => onDeleteMeeting(meeting.id)}
                    className="text-zinc-550 hover:text-red-500 shrink-0"
                    title="Cancel call"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-muted-foreground text-left min-w-0">
                  <p className="flex items-center gap-1.5 truncate"><User className="w-3.5 h-3.5 text-[#C9A84C]" /> {meeting.leadName}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#C9A84C]" /> {new Date(meeting.date).toLocaleDateString()}</p>
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#C9A84C]" /> {meeting.time}</p>
                </div>

                {meeting.notes && (
                  <p className="bg-muted/50 p-2 border border-border text-[10px] text-muted-foreground italic leading-relaxed text-left">
                    "{meeting.notes}"
                  </p>
                )}
              </div>
            </Card>
          ))}

          {meetings.length === 0 && (
            <div className="col-span-full py-12 bg-muted/50 border border-border text-center text-xs text-muted-foreground italic">
              No meetings scheduled. Click "Schedule Meeting" to book a client callback.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
