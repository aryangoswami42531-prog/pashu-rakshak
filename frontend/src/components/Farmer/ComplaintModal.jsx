import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, X, Send, ShieldAlert } from 'lucide-react';

export const ComplaintModal = ({ isOpen, onClose }) => {
  const { vetsList, showToast, refreshAllData } = useApp();
  const [vetId, setVetId] = useState(vetsList[0]?.id || '');
  const [issueType, setIssueType] = useState('DELAYED_RESPONSE');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      showToast("Please enter complaint details", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: "Harpreet Singh",
          farmerPhone: "+91 98711 22334",
          vetId,
          issueType,
          description
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        onClose();
        refreshAllData();
      }
    } catch (err) {
      showToast("Could not submit complaint", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-700 p-6 space-y-5 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Report Unresponsive Officer / Grievance</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          This complaint will be directly audited by District Biosecurity Cell & District Magistrate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select Officer:</label>
            <select
              value={vetId}
              onChange={e => setVetId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            >
              {vetsList.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.designation})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Issue Category:</label>
            <select
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="DELAYED_RESPONSE">Delayed / No Emergency Response (&gt; 4 hours)</option>
              <option value="UNPROFESSIONAL_BEHAVIOR">Unprofessional Conduct</option>
              <option value="FEE_EXORTION">Refusal to Provide Vaccination / Extra Fee Demand</option>
              <option value="FALSE_REPORTS">False Health Certificate Issue</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Detailed Description & Incident Time:</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what happened, requested time, and emergency severity..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Filing...' : 'Lodge Official Complaint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
