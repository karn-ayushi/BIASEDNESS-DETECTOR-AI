import React from 'react';
import { BookOpen } from 'lucide-react';

export const Glossary: React.FC = () => {
  const terms = [
    {
      term: 'Selection Rate',
      definition: 'The percentage of candidates from a specific group who are hired or selected.',
      icon: '📊'
    },
    {
      term: 'Disparate Impact',
      definition: 'When a system unintentionally discriminates against a protected group, even if the rules seem neutral.',
      icon: '⚖️'
    },
    {
      term: 'Impact Ratio',
      definition: 'Calculated as (Selection Rate of Unprivileged) / (Selection Rate of Privileged). Below 0.8 flags a bias.',
      icon: '🔍'
    },
    {
      term: 'Protected Attribute',
      definition: 'Traits like Gender, Age, or Region that should not legally influence hiring decisions.',
      icon: '🛡️'
    },
    {
      term: 'Bias Mitigation',
      definition: 'Methods applied to algorithms to remove discriminatory patterns and ensure fair outcomes.',
      icon: '🛠️'
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-4 h-4 text-[#d4af37]" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Glossary</h2>
      </div>
      <div className="space-y-4">
        {terms.map((item, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white/90">{item.term}</span>
            </div>
            <p className="text-[10px] leading-relaxed text-white/30 italic pl-3 border-l border-white/10 ml-1">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
