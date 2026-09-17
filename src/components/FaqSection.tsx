import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../types';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24" data-purpose="faq-accordion">
      <div className="border-t border-night-800 pt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8 text-center">
          Frequently asked questions
        </h2>

        <div className="space-y-4" id="faq-list">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-night-900 border border-night-700/80 rounded-xl overflow-hidden p-5 transition [&_svg]:open:-rotate-180"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white text-base">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-200" />
              </summary>
              <p className="text-slate-400 text-sm leading-relaxed mt-4 pt-3 border-t border-night-800">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
