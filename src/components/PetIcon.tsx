import React from 'react';
import { FaCat, FaDog } from 'react-icons/fa';
import { GiCat, GiSittingDog } from 'react-icons/gi';

interface PetIconProps {
  type: 'cat' | 'dog';
  size?: number;
  color?: string;
}

const PetIcon: React.FC<PetIconProps> = ({ type, size = 48, color = '#000000' }) => {
  const iconStyle = { width: size, height: size, color };

  switch (type) {
    case 'cat':
      return Math.random() > 0.5 ? <FaCat style={iconStyle} /> : <GiCat style={iconStyle} />;
    case 'dog':
      return Math.random() > 0.5 ? <FaDog style={iconStyle} /> : <GiSittingDog style={iconStyle} />;
    default:
      return null;
  }
};

export default PetIcon;

