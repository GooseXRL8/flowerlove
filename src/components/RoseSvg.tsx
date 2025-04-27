
import React from 'react';

interface RoseSvgProps {
  scale: number;
}

const RoseSvg: React.FC<RoseSvgProps> = ({ scale }) => {
  return (
    <svg className="w-full h-full" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
      <g id="flowerGroup" style={{ transform: `scale(${scale}) translate(100px, 250px)`, transformOrigin: 'bottom center', transition: 'transform 1s ease-out' }}>
        {/* Stem */}
        <rect x="-5" y="-200" width="10" height="200" fill="#4CAF50" />
        {/* Leaves */}
        <ellipse cx="-15" cy="-100" rx="20" ry="10" fill="#66BB6A" />
        <ellipse cx="15" cy="-140" rx="20" ry="10" fill="#66BB6A" />
        {/* Petals */}
        <circle cx="0" cy="-220" r="40" fill="#E91E63" />
        <circle cx="-35" cy="-200" r="30" fill="#F48FB1" />
        <circle cx="35" cy="-200" r="30" fill="#F48FB1" />
        <circle cx="-20" cy="-240" r="30" fill="#F06292" />
        <circle cx="20" cy="-240" r="30" fill="#F06292" />
      </g>
    </svg>
  );
};

export default RoseSvg;
