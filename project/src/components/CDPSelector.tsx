import React from 'react';
import { CDP } from '../types';
import { cdps } from '../data/cdps';

interface CDPSelectorProps {
  selectedCDP: CDP | null;
  onSelectCDP: (cdp: CDP | null) => void;
  darkMode: boolean;
}

const CDPSelector: React.FC<CDPSelectorProps> = ({ selectedCDP, onSelectCDP, darkMode }) => {
  return (
    <div className="flex flex-col mb-6">
      <h3 className="text-lg font-medium mb-2">Select a CDP Platform</h3>
      <div className="flex flex-wrap gap-2">
        {cdps.map((cdp) => (
          <button
            key={cdp.id}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              selectedCDP?.id === cdp.id
                ? `${cdp.color} text-white border-transparent`
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelectCDP(selectedCDP?.id === cdp.id ? null : cdp)}
          >
            <img src={cdp.logo} alt={cdp.name} className="w-5 h-5 mr-2" />
            {cdp.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CDPSelector;