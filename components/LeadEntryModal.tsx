"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { createLead } from "@/lib/supabase/queries";
import type { LeadType, LeadStage } from "@/lib/types/database";

interface LeadEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const leadTypes: { id: LeadType; label: string }[] = [
  { id: "dominion_sponsors", label: "Dominion Sponsor" },
  { id: "sba_leads", label: "SBA Loan Lead" },
  { id: "trimlight_residential", label: "Trimlight" },
  { id: "trimlight_commercial", label: "Trimlight" },
  { id: "rooted_homeowners", label: "Rooted Homeowner" },
  { id: "rooted_providers", label: "Rooted Provider" },
];

const stages: { id: LeadStage; label: string }[] = [
  { id: "lead", label: "Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed", label: "Closed" },
];

const underwritingStages = [
  "Application Submitted",
  "Credit Review",
  "Underwriting",
  "Approval Pending",
  "Approved",
  "Funding",
];

const sponsorshipAssets = [
  "Banner",
  "Event Sponsorship",
  "Seasonal Partnership",
  "Digital Marketing",
  "Product Placement",
];

export default function LeadEntryModal({ isOpen, onClose, onSave }: LeadEntryModalProps) {
  const [formData, setFormData] = useState({
    lead_type: "sba_leads" as LeadType,
    name: "",
    company: "",
    email: "",
    phone: "",
    stage: "lead" as LeadStage,
    value: "",
    notes: "",
    // SBA specific
    loan_amount: "",
    underwriting_stage: "",
    // Trimlight specific
    is_commercial: false,
    // Dominion specific
    sponsorship_asset: "",
    // Landscaping specific
    referral_partner: "",
  });

  const [isLandscaping, setIsLandscaping] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handle lead type change - if Trimlight, auto-set commercial/residential
  useEffect(() => {
    if (formData.lead_type === "trimlight_residential") {
      setFormData((prev) => ({ ...prev, is_commercial: false }));
    } else if (formData.lead_type === "trimlight_commercial") {
      setFormData((prev) => ({ ...prev, is_commercial: true }));
    }
  }, [formData.lead_type]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        lead_type: "sba_leads",
        name: "",
        company: "",
        email: "",
        phone: "",
        stage: "lead",
        value: "",
        notes: "",
        loan_amount: "",
        underwriting_stage: "",
        is_commercial: false,
        sponsorship_asset: "",
        referral_partner: "",
      });
      setIsLandscaping(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log("=== Lead Entry Form Submit ===");
    console.log("Form data:", formData);
    console.log("Is Landscaping:", isLandscaping);

    try {
      // Determine final lead_type - if Trimlight is selected, use the appropriate type
      let finalLeadType = formData.lead_type;
      if (formData.lead_type === "trimlight_residential" || formData.lead_type === "trimlight_commercial") {
        finalLeadType = formData.is_commercial ? "trimlight_commercial" : "trimlight_residential";
      }

      const leadData: any = {
        lead_type: finalLeadType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: formData.stage,
        company: formData.company || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        notes: formData.notes || undefined,
      };

      // Add SBA-specific fields
      if (finalLeadType === "sba_leads") {
        leadData.loan_amount = formData.loan_amount ? parseFloat(formData.loan_amount) : undefined;
        leadData.underwriting_stage = formData.underwriting_stage || undefined;
      }

      // Add Trimlight-specific fields
      if (finalLeadType === "trimlight_residential" || finalLeadType === "trimlight_commercial") {
        leadData.is_commercial = formData.is_commercial;
      }

      // Add Dominion-specific fields
      if (finalLeadType === "dominion_sponsors") {
        leadData.sponsorship_asset = formData.sponsorship_asset || undefined;
      }

      // Add Referral Partner if landscaping is checked
      if (isLandscaping) {
        leadData.referral_partner = formData.referral_partner || undefined;
      }

      console.log("Calling createLead with prepared data:", leadData);

      const result = await createLead(leadData);

      if (result) {
        console.log("Lead created successfully! ID:", result.id);
        onSave();
        onClose();
      } else {
        console.error("createLead returned null - check console for errors above");
        alert("Error saving lead. Check console for details.");
      }
    } catch (error) {
      console.error("=== EXCEPTION in handleSubmit ===");
      console.error("Error type:", typeof error);
      console.error("Error object:", error);
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      alert(`Error saving lead: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isSBALead = formData.lead_type === "sba_leads";
  const isTrimlightLead = formData.lead_type === "trimlight_residential" || formData.lead_type === "trimlight_commercial";
  const isDominionLead = formData.lead_type === "dominion_sponsors";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-full shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lead Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Lead Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.lead_type}
              onChange={(e) => setFormData({ ...formData, lead_type: e.target.value as LeadType })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="sba_leads">SBA Loan Lead</option>
              <option value="dominion_sponsors">Dominion Sponsor</option>
              <option value="trimlight_residential">Trimlight (Residential)</option>
              <option value="trimlight_commercial">Trimlight (Commercial)</option>
              <option value="rooted_homeowners">Rooted Homeowner</option>
              <option value="rooted_providers">Rooted Provider</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Stage <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as LeadStage })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deal Value ($)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          {/* SBA Lead Specific Fields */}
          {isSBALead && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3">SBA Loan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={formData.loan_amount}
                    onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Underwriting Stage</label>
                  <select
                    value={formData.underwriting_stage}
                    onChange={(e) => setFormData({ ...formData, underwriting_stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  >
                    <option value="">Select stage</option>
                    {underwritingStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Trimlight Specific Fields */}
          {isTrimlightLead && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3">Trimlight Type</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.is_commercial}
                    onChange={() => setFormData({ ...formData, is_commercial: false })}
                    className="w-4 h-4"
                  />
                  <span>Residential</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.is_commercial}
                    onChange={() => setFormData({ ...formData, is_commercial: true })}
                    className="w-4 h-4"
                  />
                  <span>Commercial</span>
                </label>
              </div>
            </div>
          )}

          {/* Dominion Sponsor Specific Fields */}
          {isDominionLead && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3">Sponsorship Asset</h3>
              <select
                value={formData.sponsorship_asset}
                onChange={(e) => setFormData({ ...formData, sponsorship_asset: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="">Select asset</option>
                {sponsorshipAssets.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Landscaping Referral Partner */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isLandscaping}
                onChange={(e) => setIsLandscaping(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-semibold">Landscaping Referral</span>
            </label>
            {isLandscaping && (
              <div>
                <label className="block text-sm font-medium mb-2">Referral Partner</label>
                <input
                  type="text"
                  value={formData.referral_partner}
                  onChange={(e) => setFormData({ ...formData, referral_partner: e.target.value })}
                  placeholder="Enter referral partner name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-6 -mb-6 mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
