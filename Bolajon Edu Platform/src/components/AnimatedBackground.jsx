import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground({ type }) {
  // Elements generator
  const renderElements = (count, icon, sizeRange, durationRange, isFallingContext = false) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const left = Math.random() * 100;
      const duration = Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0];
      
      // Floating items should have no delay since they start inside the screen. 
      // Falling items can have a very tiny stagger so they donʻt fall in a perfect straight line.
      const fallDelay = Math.random() * 5; 

      if (isFallingContext) {
        // Playful Falling animation (snow, leaves, flowers) - zig-zag drift
        return (
          <motion.div
            key={`fall-${i}`}
            initial={{ y: -50, x: `${left}vw`, opacity: 0.9 }}
            animate={{ 
              y: '120vh', 
              x: [`${left}vw`, `${left + 10}vw`, `${left - 10}vw`, `${left}vw`],
              rotate: [0, 45, -45, 20, -20]
            }}
            transition={{ 
              y: { duration, delay: fallDelay, repeat: Infinity, ease: 'linear' },
              x: { duration: duration / 2, delay: fallDelay, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: Math.max(duration / 3, 3), repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ position: 'absolute', top: 0, left: 0, fontSize: `${size}rem`, zIndex: 0, pointerEvents: 'none', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))' }}
          >
            {icon}
          </motion.div>
        );
      } else {
         // Cute Bouncing/Floating Toys - Wobble, Squash & Stretch style
        return (
          <motion.div
            key={`float-${i}`}
            initial={{ y: `${Math.random() * 90}vh`, x: `${Math.random() * 90}vw`, opacity: 1 }}
            animate={{ 
              y: [`${Math.random() * 90}vh`, `${Math.random() * 90}vh`], 
              x: [`${Math.random() * 90}vw`, `${Math.random() * 90}vw`],
              rotate: [0, 15, -15, 10, -10, 0],
              scale: [1, 1.2, 0.9, 1.1, 1]
            }}
            transition={{ 
              duration: duration * 1.5, 
              repeat: Infinity, 
              repeatType: 'reverse', 
              ease: 'easeInOut' 
            }}
            style={{ position: 'absolute', top: 0, left: 0, fontSize: `${size}rem`, zIndex: 0, pointerEvents: 'none', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.25))' }}
          >
            {icon}
          </motion.div>
        );
      }
    });
  };

  const nurseryPattern = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23e0e0e0' stroke-width='1.5'%3E%3Ccircle cx='15' cy='15' r='5'/%3E%3Cpolygon points='50,10 55,20 45,20'/%3E%3Cpolygon points='30,50 35,50 37,55 33,60 27,60 25,55'/%3E%3Cpolygon points='65,45 67,51 73,51 68,55 70,61 65,57 60,61 62,55 57,51 63,51'/%3E%3C/g%3E%3C/svg%3E")`;

  // Define base colors based on season
  let bgColor = '#fafafa';
  let blob1 = '#FCE7F3'; // Pinkish
  let blob2 = '#E0F2FE'; // Blueish
  let blob3 = '#DCFCE7'; // Greenish
  let blob4 = '#FFEDD5'; // Orangey

  if (type === 'autumn') {
    bgColor = '#fffdf5';
    blob1 = '#ffedd5'; blob2 = '#fef3c7'; blob3 = '#ffedd5'; blob4 = '#fce7f3';
  } else if (type === 'winter') {
    bgColor = '#f4faff';
    blob1 = '#e0f2fe'; blob2 = '#dbeafe'; blob3 = '#f1f5f9'; blob4 = '#e0f2fe';
  } else if (type === 'spring') {
    bgColor = '#f5fdf4';
    blob1 = '#dcfce7'; blob2 = '#fce7f3'; blob3 = '#ecfccb'; blob4 = '#e0f2fe';
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', backgroundColor: bgColor, backgroundImage: nurseryPattern }}>
      
      {/* Animated Corner Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: blob1, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', zIndex: 0, opacity: 0.8 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-5%', right: '-5%', width: '30vw', height: '30vw', background: blob2, borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%', zIndex: 0, opacity: 0.8 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }} 
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '45vw', height: '35vw', background: blob3, borderRadius: '30% 70% 60% 40% / 50% 40% 60% 50%', zIndex: 0, opacity: 0.8 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '35vw', height: '35vw', background: blob4, borderRadius: '60% 40% 50% 50% / 40% 60% 40% 60%', zIndex: 0, opacity: 0.8 }} 
      />

      {/* Floating Educational / General Elements */}
      {renderElements(4, '\u2B50', [1, 2.5], [20, 40], false)}
      {renderElements(2, '\u2708\uFE0F', [2, 3], [15, 25], false)}
      {renderElements(2, '\uD83D\uDD8D\uFE0F', [2, 3.5], [25, 45], false)}

      {/* Seasonal Specific Elements overlay */}
      {type === 'autumn' && (
        <>
          {renderElements(15, '\uD83C\uDF42', [1.5, 3], [10, 20], true)}
          {renderElements(10, '\uD83C\uDF41', [1.5, 3], [12, 22], true)}
        </>
      )}

      {type === 'winter' && (
        <>
           {renderElements(30, '\u2744\uFE0F', [1, 2], [8, 15], true)}
        </>
      )}

      {type === 'spring' && (
        <>
          {renderElements(15, '\uD83C\uDF38', [1.5, 2.5], [12, 20], true)}
          {renderElements(6, '\uD83E\uDD8B', [1, 2], [15, 25], true)}
        </>
      )}

    </div>
  );
}
