import React from 'react';

interface ControlPanelProps {
  onNotebookToggle: () => void;
  bgColor: string;
  textColor: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onNotebookToggle, bgColor, textColor }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
      <button
        onClick={onNotebookToggle}
        className="p-2 rounded-full shadow-md transition-transform hover:scale-110"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        📓
      </button>
      <button className="bg-gray-200 p-2 rounded-full shadow-md">
        ⚙️
      </button>
    </div>
  );
};

export default ControlPanel;

