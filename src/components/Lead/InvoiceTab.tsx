import React, { useState } from "react";
import { Invoice, ScoredLead } from "./types";
import { DollarSign, FileText, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { printInvoice } from "./utils";

interface InvoiceTabProps {
  lead: ScoredLead;
  invoices: Invoice[];
  onCreateInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => void;
  onUpdateInvoiceStatus: (id: string, status: "PAID" | "PENDING") => void;
  onDeleteInvoice: (id: string) => void;
}

export default React.memo(function InvoiceTab({
  lead,
  invoices,
  onCreateInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
}: InvoiceTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState("Monthly SEO & Speed Optimization Retainer Package");
  const [amount, setAmount] = useState(() => {
    const priceStr = lead.auditData?.proposal?.pricing || "$1250";
    const matches = priceStr.match(/\d[\d,.]*/);
    return matches ? parseFloat(matches[0].replace(/,/g, "")) : 1250;
  });
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !dueDate) return;

    onCreateInvoice({
      leadId: lead.id,
      leadName: lead.name,
      date: new Date().toISOString().split("T")[0],
      dueDate,
      amount,
      status: "PENDING",
      description
    });

    setDescription("Monthly SEO & Speed Optimization Retainer Package");
    setDueDate("");
    setShowAddForm(false);
  };

  const clientInvoices = invoices.filter((inv) => inv.leadId === lead.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider">
          Client Billing & Invoices
        </h4>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-transparent hover:bg-[#C9A84C]/10 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-semibold tracking-wider uppercase px-4 py-1.5 h-auto rounded-none"
        >
          Create Invoice
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass p-4 border border-zinc-800 space-y-4 text-xs leading-relaxed max-w-lg">
          <div className="space-y-1.5">
            <Label htmlFor="inv-desc" className="text-[10px] uppercase text-[#F5F0E8]/50 font-semibold tracking-wider">Line Item Description</Label>
            <Input
              id="inv-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inv-amount" className="text-[10px] uppercase text-[#F5F0E8]/50 font-semibold tracking-wider">Amount ($)</Label>
              <Input
                id="inv-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                required
                className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inv-due" className="text-[10px] uppercase text-[#F5F0E8]/50 font-semibold tracking-wider">Due Date</Label>
              <Input
                id="inv-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-zinc-900 text-white px-3 py-1.5 rounded-none text-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C9A84C] text-black px-4 py-1.5 rounded-none text-[10px]"
            >
              Save Invoice
            </Button>
          </div>
        </form>
      )}

      {/* Invoices list */}
      <div className="space-y-3">
        {clientInvoices.map((inv) => (
          <div key={inv.id} className="bg-black p-4 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-left">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">{inv.invoiceNumber}</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold ${
                  inv.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-zinc-500 truncate">{inv.description}</p>
              <p className="text-[10px] text-zinc-600">Due Date: {new Date(inv.dueDate).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 border-t sm:border-t-0 border-zinc-900/60 pt-3 sm:pt-0 w-full sm:w-auto">
              <span className="text-[#C9A84C] font-bold text-sm">${inv.amount.toLocaleString()}</span>
              
              <div className="flex gap-2">
                <select
                  value={inv.status}
                  onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as "PAID" | "PENDING")}
                  className="bg-black border border-zinc-800 text-[10px] py-1 px-1 outline-none cursor-pointer rounded-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>

                <button
                  onClick={() => printInvoice(inv)}
                  className="p-1 text-sky-400 hover:text-white"
                  title="Print invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteInvoice(inv.id)}
                  className="p-1 text-zinc-500 hover:text-red-500"
                  title="Delete invoice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {clientInvoices.length === 0 && (
          <p className="text-zinc-500 italic text-center py-6">No invoices created for this client yet.</p>
        )}
      </div>
    </div>
  );
});
