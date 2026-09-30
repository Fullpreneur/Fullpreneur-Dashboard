"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { createLead } from "@/lib/supabase/queries";
import type { LeadStage, LeadType } from "@/lib/types/database";

interface LeadEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const leadTypes: { id: LeadType; label: string }[] = [
  { id: "customer", label: "Customer" },
  { id: "partner", label: "Partner" },
  { id: "referral", label: "Referral" },
  { id: "other", label: "Other" },
];

const stages: { id: LeadStage; label: string }[] = [
  { id: "lead", label: "Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed", label: "Closed" },
];

const emptyForm = {
  lead_type: "customer" as LeadType,
  name: "",
  company: "",
  email: "",
  phone: "",
  stage: "lead" as LeadStage,
  value: "",
  notes: "",
};

export default function LeadEntryModal({ isOpen, onClose, onSave }: LeadEntryModalProps) {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) setFormData(emptyForm);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await createLead({
        lead_type: formData.lead_type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: formData.stage,
        company: formData.company || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        notes: formData.notes || undefined,
      });
      if (result) {
        onSave();
        onClose();
      } else {
        alert("Error saving lead. Check console for details.");
      }
    } catch (error) {
      alert(`Error saving lead: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white dark:bg-gray-800 w-full min-w-0 max-w-2xl h-full shadow-xl overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 w-full min-w-0">
          <div>
            <label className="block text-sm font-medium mb-2">Lead Type</label>
            <select
              required
              value={formData.lead_type}
              onChange={(e) => setFormData({ ...formData, lead_type: e.target.value as LeadType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              {leadTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select required value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value as LeadStage })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deal Value ($)</label>
              <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900" placeholder="Add any additional notes..." />
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
