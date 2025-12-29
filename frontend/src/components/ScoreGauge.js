import { useEffect, useState } from 'react';

export const ScoreGauge = ({ score, verdict, size = 180 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (verdict === 'buy') return '#10B981';
    if (verdict === 'think') return '#F59E0B';
    return '#EF4444';
  };

  const getLabel = () => {
    if (verdict === 'buy') return 'BUY';
    if (verdict === 'think') return 'THINK';
    return 'AVOID';
  };

  return (
    <div className="relative flex flex-col items-center" data-testid="score-gauge">
      <svg width={size} height={size} className="score-gauge">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="score-gauge-bg"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="score-gauge-fill"
          style={{
            stroke: getColor(),
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
          }}
        />
      </svg>
      
      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="score-gauge-text"
          style={{ color: getColor() }}
          data-testid="score-value"
        >
          {animatedScore}
        </span>
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Confidence
        </span>
      </div>

      {/* Verdict Badge */}
      <div 
        className={`verdict-badge ${verdict} mt-4`}
        data-testid="verdict-badge"
      >
        {getLabel()}
      </div>
    </div>
  );
};

export default ScoreGauge;
