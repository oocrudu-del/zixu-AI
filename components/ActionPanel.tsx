
import React from 'react';

interface ActionPanelProps {
  onAction: (prompt: string, type: 'text' | 'image') => void;
  disabled: boolean;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, disabled }) => {
  const actions = [
    { label: "Seek Wisdom", prompt: "Master, please share a poetic truth about life.", icon: "🏮" },
    { label: "Paint a Dream", prompt: "Paint a landscape of mist and mountains.", icon: "🎨", type: 'image' },
    { label: "Write a Verse", prompt: "Compose a short poem about the moonlight on a river.", icon: "✒️" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onAction(action.prompt, (action.type as any) || 'text')}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-100 bg-emerald-50/50 
                     text-emerald-800 text-sm hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionPanel;
