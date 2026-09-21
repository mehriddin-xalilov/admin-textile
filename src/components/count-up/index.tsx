import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  formatter?: (value: number) => string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 800, formatter }) => {
  const [count, setCount] = useState(0);
  const prevEndRef = useRef(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = prevEndRef.current;
    const endValue = end;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: outQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.floor(easeProgress * (endValue - startValue) + startValue);

      setCount(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    prevEndRef.current = end;
  }, [end, duration]);

  return <>{formatter ? formatter(count) : count}</>;
};

export default CountUp;
