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

  // Safe Core: Map both old and new verdict formats
  const normalizeVerdict = (v) => {
    const map = {
      'buy': 'great_match', 'BUY': 'great_match', 'great_match': 'great_match',
      'think': 'good_match', 'THINK': 'good_match', 'good_match': 'good_match',
      'avoid': 'consider_options', 'AVOID': 'consider_options', 'consider_options': 'consider_options'
    };
    return map[v] || 'good_match';
  };

  const normalizedVerdict = normalizeVerdict(verdict);

  const getColor = () => {
    if (normalizedVerdict === 'great_match') return '#10B981';
    if (normalizedVerdict === 'good_match') return '#F59E0B';
    return '#6366F1'; // Purple for consider_options (neutral, not alarming)
  };

  const getLabel = () => {
    if (normalizedVerdict === 'great_match') return 'GREAT MATCH';
    if (normalizedVerdict === 'good_match') return 'GOOD MATCH';
    return 'CONSIDER OPTIONS';
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
        className={`verdict-badge ${normalizedVerdict} mt-4`}
        style={{
          backgroundColor: normalizedVerdict === 'great_match' ? 'rgba(16, 185, 129, 0.1)' :
                          normalizedVerdict === 'good_match' ? 'rgba(245, 158, 11, 0.1)' :
                          'rgba(99, 102, 241, 0.1)',
          borderColor: normalizedVerdict === 'great_match' ? 'rgba(16, 185, 129, 0.3)' :
                       normalizedVerdict === 'good_match' ? 'rgba(245, 158, 11, 0.3)' :
                       'rgba(99, 102, 241, 0.3)',
          color: getColor()
        }}
        data-testid="verdict-badge"
      >
        {getLabel()}
      </div>
    </div>
  );
};

export default ScoreGauge;
