import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, X, Send } from 'lucide-react';

export const ComplaintModal = ({ isOpen, onClose }) => {
  const { vetsList, showToast, refreshAllData } = useApp();
  const [vetId, setVetId] = useState('vet-101');
  const [issueType, setIssueType] = useState('UNRESPONSIVE_VET');
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
        cache: 'no-store',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Select Veterinary Officer</label>
            <select
              value={vetId}
              onChange={(e) => setVetId(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            >
              {vetsList.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.district})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Grievance Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="UNRESPONSIVE_VET">Doctor Unresponsive to Emergency Dispatch</option>
              <option value="DELAYED_VISIT">Severe Delay in Field Inspection</option>
              <option value="WRONG_DIAGNOSIS">Incorrect Prescription or Treatment</option>
              <option value="OVERCHARGING">Overcharging for Free Vaccines</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Detailed Incident Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident, delay duration, and impact on your livestock..."
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold flex items-center gap-1.5 shadow-lg shadow-red-600/30 btn-pop"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Grievance...' : 'Submit Official Grievance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
