import React, { useState } from 'react';
import { X, Check, Save, Plus, Trash2, User } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface EditInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updated: UserProfile) => void;
  language: Language;
}

export const EditInfoModal: React.FC<EditInfoModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
  language,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [primaryProvider, setPrimaryProvider] = useState(userProfile.primaryProvider);
  const [clinic, setClinic] = useState(userProfile.clinic);
  const [emergencyName, setEmergencyName] = useState(userProfile.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(userProfile.emergencyContact.phone);
  const [allergiesText, setAllergiesText] = useState(userProfile.allergies.join(', '));
  const [newTriggerName, setNewTriggerName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAllergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let updatedTriggers = [...userProfile.pinnedTriggers];
    if (newTriggerName.trim()) {
      updatedTriggers.push({
        id: `trig-${Date.now()}`,
        name: newTriggerName.trim(),
        category: 'skincare',
        riskBadge: 'User Added',
        notes: 'Manually entered into Health Board.',
        dateAdded: 'Today',
      });
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      age: Number(age) || 28,
      primaryProvider,
      clinic,
      allergies: updatedAllergies,
      pinnedTriggers: updatedTriggers,
      emergencyContact: {
        ...userProfile.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone,
      },
    };

    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-purple-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#B6A1DA] px-5 py-4 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs">
              <User className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                Personal Settings
              </span>
              <h3 className="font-extrabold text-base leading-tight">
                Edit Health Information
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
              Primary Care Physician & Clinic
            </label>
            <input
              type="text"
              value={primaryProvider}
              onChange={(e) => setPrimaryProvider(e.target.value)}
              className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
              Documented Allergies (comma separated)
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="e.g. Penicillin, Pollen, Sulfa"
              className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
              Add New Custom Allergen / Trigger
            </label>
            <input
              type="text"
              value={newTriggerName}
              onChange={(e) => setNewTriggerName(e.target.value)}
              placeholder="e.g. Phenoxyethanol, Dairy, Shellfish"
              className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                Emergency Phone
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-[#F3EDF7] rounded-xl px-3 py-2 border border-purple-200 text-xs font-semibold text-slate-900 outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3 px-4 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Save className="w-4 h-4 text-slate-900" />
              <span>Save & Update Health Board</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
