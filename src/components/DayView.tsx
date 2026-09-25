import React, { useState } from 'react';
import {
  ChevronLeft,
  Edit2,
  Video,
  Clock,
  Plus,
  Play,
  Image as ImageIcon,
  FolderPlus,
  Utensils,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { FoodLogEntry, UserCollection } from '../types';

interface DayViewProps {
  onBackToCalendar: () => void;
  foodLogs: FoodLogEntry[];
  onAddFoodLog: (entry: Omit<FoodLogEntry, 'id'>) => void;
  onOpenSoapModal: () => void;
  collections: UserCollection[];
  onAddToCollection: (collectionId: string, dayLabel: string, content: string, type: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  onBackToCalendar,
  foodLogs,
  onAddFoodLog,
  onOpenSoapModal,
  collections,
  onAddToCollection,
}) => {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [foodText, setFoodText] = useState('');
  const [foodTime, setFoodTime] = useState('11:00 AM');
  const [foodLocation, setFoodLocation] = useState('Campus Cafe');
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const day12Foods = foodLogs.filter((f) => f.day === 12);

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodText.trim()) return;

    onAddFoodLog({
      day: 12,
      dateStr: 'Thursday, June 12',
      time: foodTime || '12:00 PM',
      item: foodText.trim(),
      location: foodLocation || undefined,
      suspectedTrigger: foodText.toLowerCase().includes('caramel') || foodText.toLowerCase().includes('oat'),
      notes: 'Logged into calendar. Sheila will cross-reference this if you experience symptoms.',
    });

    setFoodText('');
    setIsAddingFood(false);
    setAddedToast('Food logged into Thursday, June 12!');
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleDemoCaramelLatte = () => {
    onAddFoodLog({
      day: 12,
      dateStr: 'Thursday, June 12',
      time: '11:00 AM',
      item: 'Iced Latte with caramel drizzle',
      location: 'Campus Cafe',
      suspectedTrigger: true,
      notes: 'Asked for extra caramel drizzle. Did not know caramel syrup contains barley malt.',
    });
    setAddedToast('Logged: Iced Latte with caramel drizzle (11:00 AM)');
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleSaveToCollection = (colId: string) => {
    onAddToCollection(
      colId,
      'THU · JUNE 12',
      'Wellness check-in & logged iced latte with caramel drizzle.',
      'Check-in & Food'
    );
    setShowCollectionPicker(false);
    setAddedToast(`Added to collection!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="space-y-4 px-4 py-3 bg-[#F3EDF7] min-h-[750px] text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCalendar}
          className="flex items-center gap-1 text-xs font-extrabold text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full border border-purple-200 shadow-2xs transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-purple-700" />
          <span>Calendar</span>
        </button>

        <button className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white px-3 py-1.5 rounded-full border border-purple-200/60 shadow-2xs transition">
          <Edit2 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            YOUR DAY
          </span>
          <span className="text-[9px] font-black uppercase bg-[#EAE06D] text-slate-900 px-2 py-0.5 rounded-full border border-yellow-400 shadow-2xs">
            TODAY
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Thursday, June 12
        </h2>
      </div>

      {/* Toast */}
      {addedToast && (
        <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-fade-in border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-[#EAE06D]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Appointment Card (Matching Mockup exactly) */}
      <div className="bg-[#B6A1DA] rounded-3xl p-4 text-slate-900 shadow-sm space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-950/80 block">
          APPOINTMENT · 10:30 AM
        </span>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EAE06D] flex items-center justify-center text-slate-900 shadow-xs shrink-0">
            <Video className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
              Wellness check-in with Dr. Jordan Lee
            </h3>
            <p className="text-xs text-purple-950/80 font-medium">
              Video appointment
            </p>
          </div>
        </div>
      </div>

      {/* Journal Card (Matching Mockup exactly) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            JOURNAL
          </span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <span>9:12 PM</span>
            <Edit2 className="w-3 h-3 text-slate-400" />
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          &ldquo;Felt calmer after my check-in today. Went for a short walk after dinner and slept better.&rdquo;
        </p>
      </div>

      {/* Photos & Videos (Matching Mockup exactly) */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
          PHOTOS &amp; VIDEOS
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* Photo 1 */}
          <div className="bg-[#EAE06D]/40 border border-yellow-300 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 h-20 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#EAE06D] flex items-center justify-center text-slate-900">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800">[Photo]</span>
          </div>

          {/* Video */}
          <div className="bg-[#E8DFF2] border border-purple-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 h-20 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <span className="text-[10px] font-bold text-purple-950">Video · 0:24</span>
          </div>

          {/* Upload Button */}
          <label className="bg-white hover:bg-slate-50 border-2 border-dashed border-purple-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 h-20 cursor-pointer shadow-2xs transition">
            <Plus className="w-5 h-5 text-purple-700" />
            <span className="text-[10px] font-bold text-slate-700">Upload</span>
            <input type="file" className="hidden" accept="image/*,video/*" />
          </label>
        </div>
      </div>

      {/* Food & Drink Log Section (Solving Requirement #1) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-purple-700" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              WHAT I ATE OR DRANK TODAY
            </span>
          </div>
          <span className="text-[9px] bg-[#EAE06D] text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
            Sheila Cross-Check
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          Log food or drinks naturally without worrying. If you experience unexpected tremors, burning feet, or brain fog later, Sheila connects the dots!
        </p>

        {/* Logged Foods List */}
        <div className="space-y-2">
          {day12Foods.map((f) => (
            <div
              key={f.id}
              className={`p-2.5 rounded-2xl border text-xs flex items-start justify-between gap-2 ${
                f.suspectedTrigger
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-[#F3EDF7]/70 border-purple-200/80 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{f.time}</span>
                  <span>·</span>
                  <span className="text-slate-900 font-extrabold">{f.item}</span>
                  {f.location && (
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({f.location})
                    </span>
                  )}
                </div>
                {f.notes && (
                  <p className="text-[10px] text-slate-600 mt-0.5">{f.notes}</p>
                )}
              </div>
              {f.suspectedTrigger && (
                <span className="text-[9px] font-black bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded shrink-0">
                  Hidden Gluten Risk
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 1-Click Demo & Add Food Buttons */}
        {!isAddingFood ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setIsAddingFood(true)}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-2 px-3 rounded-2xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-700" />
              <span>Log Food / Drink</span>
            </button>

            <button
              onClick={handleDemoCaramelLatte}
              className="bg-[#EAE06D] hover:bg-yellow-300 text-slate-950 text-xs font-extrabold py-2 px-3 rounded-2xl shadow-2xs transition active:scale-95 cursor-pointer"
              title="Adds: Iced Latte with caramel drizzle"
            >
              <span>Demo: Caramel Drizzle Latte</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveFood} className="bg-[#F3EDF7] p-3 rounded-2xl space-y-2 border border-purple-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>What did you eat or drink?</span>
              <button
                type="button"
                onClick={() => setIsAddingFood(false)}
                className="text-[10px] text-slate-500 underline"
              >
                Cancel
              </button>
            </div>
            <input
              type="text"
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
              placeholder="e.g. Iced Latte with caramel drizzle, gluten-free sandwich..."
              className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-400"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={foodTime}
                onChange={(e) => setFoodTime(e.target.value)}
                placeholder="Time (e.g. 11:00 AM)"
                className="bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs outline-none"
              />
              <input
                type="text"
                value={foodLocation}
                onChange={(e) => setFoodLocation(e.target.value)}
                placeholder="Location (e.g. Campus Cafe)"
                className="bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs py-2 rounded-xl transition cursor-pointer"
            >
              Save to Thursday, June 12
            </button>
          </form>
        )}
      </div>

      {/* Bottom Button 1: Add to Collection (Matching Mockup exactly) */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => setShowCollectionPicker(!showCollectionPicker)}
          className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-900 font-extrabold py-3.5 px-4 rounded-full shadow-xs transition text-xs flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4 text-slate-900" />
          <span>Add to collection</span>
        </button>

        {showCollectionPicker && (
          <div className="bg-white rounded-2xl p-3 border border-purple-200 shadow-md space-y-2 animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Choose a collection to save this day:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSaveToCollection(c.id)}
                  className="bg-[#F3EDF7] hover:bg-[#E8DFF2] p-2.5 rounded-xl text-left border border-purple-200/80 transition cursor-pointer"
                >
                  <span className="font-extrabold text-xs text-purple-950 block">
                    {c.title}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {c.daysSaved} days saved
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onOpenSoapModal}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-4 rounded-full border border-slate-300 shadow-2xs transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-purple-700" />
          <span>Doctor Visit Prep Note (For Dr. Jordan Lee)</span>
        </button>
      </div>
    </div>
  );
};
