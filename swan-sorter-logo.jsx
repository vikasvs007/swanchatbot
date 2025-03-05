import React from "react";
import Image from "next/image";

const SwanSorterLogo = ({ size = 200, className = "", imageUrl = "/image.png" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="15" cy="15" r="" fill="white" stroke="#000" strokeWidth="0.5" />

        Swan body
        {/* <path d="" fill="#3B82F6" /> */}

        {/* Sorting lines */}
        {/* <rect x="7" y="10" width="2" height="6" rx="1" fill="#8B5CF6" />
        <rect x="11" y="8" width="2" height="8" rx="1" fill="#3B82F6" />
        <rect x="15" y="12" width="2" height="4" rx="1" fill="#8B5CF6" /> */}

        {/* Image inside SVG */}
        <foreignObject x="" y="8" width="250" height="250">
          <Image src={imageUrl} alt="Logo" width={30} height={30} />
        </foreignObject>
      </svg>
    </div>
  );
};

export default SwanSorterLogo;
