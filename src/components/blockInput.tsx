import React, { useState } from 'react';

type BlockWithInputProps = {
  blockType: string;
  initialValue: string; // Prop for initial value
  onValueUpdate?: (value: string) => void; // Callback to notify parent component about value changes
};

const BlockWithInput = ({ blockType, initialValue,onValueUpdate }: BlockWithInputProps) => {
  const [value, setValue] = useState(initialValue); // Set initial value in state

  const getLabelAndPlaceholder = (type:string) => {
    switch (type) {
      case 'moveFront':
        return { label: 'Move Front', placeholder: 'steps' };
      case 'moveBack':
        return { label: 'Move Back', placeholder: 'steps' };
      case 'clockwise':
        return { label: 'Clockwise', placeholder: 'degrees' };
      case 'anticlockwise':
        return { label: 'Anticlockwise', placeholder: 'degrees' };
      case 'xPosition':
        return { label: 'X Position', placeholder: 'x' };
      case 'yPosition':
        return { label: 'Y Position', placeholder: 'y' };
      default:
        return { label: 'Unknown', placeholder: 'Enter value' };
    }
  };
  const { label, placeholder } = getLabelAndPlaceholder(blockType);
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('blockLabel', blockType);
        e.dataTransfer.setData('blockValue', value);
      }}
      className="p-2 m-2 bg-blue-400 rounded flex items-center justify-between"
    >
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          onValueUpdate?.(newValue); 
        }}
        placeholder={placeholder}
        className="ml-2 p-1 w-16 rounded border border-gray-300"
      />
    </div>
  );
};

export default BlockWithInput;
