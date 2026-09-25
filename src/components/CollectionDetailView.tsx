import React, { useState } from 'react';
import { ChevronLeft, Plus, Image as ImageIcon, Video, Calendar, Sparkles } from 'lucide-react';
import { UserCollection, CollectionCard } from '../types';

interface CollectionDetailViewProps {
  collection: UserCollection;
  onBackToYou: () => void;
  onAddCard: (collectionId: string, newCard: Omit<CollectionCard, 'id'>) => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collection,
  onBackToYou,
  onAddCard,
}) => {
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [dayLabel, setDayLabel] = useState('MON · JUNE 30');
  const [type, setType] = useState('Check-in');
  const [content, setContent] = useState('');
  const [cardBg, setCardBg] = useState<'yellow' | 'white' | 'lavender'>('yellow');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddCard(collection.id, {
      dayLabel: dayLabel || 'TODAY',
      type: type || 'Journal',
      content: content.trim(),
      cardBg,
      meta: '1 note',
    });

    setContent('');
    setIsAddingDay(false);
  };

  return (
    <div className="space-y-4 px-4 py-3 bg-[#F3EDF7] min-h-[750px] text-slate-800">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToYou}
          className="flex items-center gap-1 text-xs font-extrabold text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full border border-purple-200 shadow-2xs transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-purple-700" />
          <span>You</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
          COLLECTION
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          {collection.title}
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          {collection.cards.length} days saved
        </span>
      </div>

      {/* 2-Column Grid of Cards matching Mockup Screenshot */}
      <div className="grid grid-cols-2 gap-3 items-start">
        {collection.cards.map((card) => {
          let bgClass = 'bg-white border-purple-100/80';
          if (card.cardBg === 'yellow') {
            bgClass = 'bg-[#EAE06D] border-yellow-300';
          } else if (card.cardBg === 'lavender') {
            bgClass = 'bg-[#E8DFF2] border-purple-200';
          }

          return (
            <div
              key={card.id}
              className={`${bgClass} rounded-3xl p-4 text-slate-900 shadow-sm border transition-all hover:scale-[1.01] min-h-[140px] flex flex-col justify-between`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-800/80 block">
                  {card.dayLabel}
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                  {card.type}
                </h4>
                {card.meta && (
                  <span className="text-[10px] text-slate-600 font-semibold block">
                    {card.meta}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed mt-2">
                {card.content}
              </p>
            </div>
          );
        })}

        {/* Dashed "+ Add a day" Card */}
        <button
          onClick={() => setIsAddingDay(true)}
          className="bg-transparent hover:bg-white/60 border-2 border-dashed border-purple-300 rounded-3xl p-4 text-slate-600 transition flex flex-col items-center justify-center gap-1.5 min-h-[140px] cursor-pointer active:scale-95 shadow-2xs"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-700 shadow-2xs">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold text-purple-950">Add a day</span>
        </button>
      </div>

      {/* Add Day Form Modal / Drawer */}
      {isAddingDay && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-3xl p-4 border border-purple-200 shadow-md space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900">
              Add Day to {collection.title}
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingDay(false)}
              className="text-xs text-slate-400 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                Date Label
              </label>
              <input
                type="text"
                value={dayLabel}
                onChange={(e) => setDayLabel(e.target.value)}
                placeholder="e.g. MON · JUNE 30"
                className="w-full bg-[#F3EDF7] border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                Entry Type
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Journal, Food log"
                className="w-full bg-[#F3EDF7] border border-purple-200 rounded-xl px-2.5 py-1.5 text-xs outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
              Notes / Observation
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened on this day?"
              rows={2}
              className="w-full bg-[#F3EDF7] border border-purple-200 rounded-xl p-2.5 text-xs outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">Color:</span>
            <button
              type="button"
              onClick={() => setCardBg('yellow')}
              className={`w-6 h-6 rounded-full bg-[#EAE06D] border-2 ${
                cardBg === 'yellow' ? 'border-slate-900 ring-2 ring-yellow-400' : 'border-transparent'
              }`}
            />
            <button
              type="button"
              onClick={() => setCardBg('white')}
              className={`w-6 h-6 rounded-full bg-white border-2 border-slate-300 ${
                cardBg === 'white' ? 'border-slate-900 ring-2 ring-purple-300' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setCardBg('lavender')}
              className={`w-6 h-6 rounded-full bg-[#E8DFF2] border-2 ${
                cardBg === 'lavender' ? 'border-slate-900 ring-2 ring-purple-400' : 'border-transparent'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EAE06D] hover:bg-yellow-300 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            Save Day to Collection
          </button>
        </form>
      )}
    </div>
  );
};
