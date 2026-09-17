import React from 'react';
import { X, BookOpen, Clock, Tag } from 'lucide-react';
import { GuideArticle } from '../types';

interface GuideModalProps {
  guide: GuideArticle | null;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-night-800 flex items-center justify-between bg-night-950/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
            <BookOpen className="w-4 h-4" />
            <span className={guide.categoryColor}>{guide.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {guide.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-400 pb-3 border-b border-night-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {guide.tag}
            </span>
          </div>

          <p className="text-base text-slate-200 font-medium leading-relaxed bg-night-950/70 p-4 rounded-xl border border-night-800/80">
            {guide.excerpt}
          </p>

          <div className="space-y-4 pt-2">
            {guide.paragraphs.map((p, idx) => (
              <p key={idx} className="text-slate-300">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-night-800 bg-night-950 flex items-center justify-between text-xs text-slate-500">
          <span>SmartCommute Commuter Education</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
