import { memo, useState, useEffect, useRef } from "react";

const AnimatedCounter = memo(function AnimatedCounter({
  value,
  duration = 1500,
  animate = true,
}: {
  value: number;
  duration?: number;
  animate?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimatedRef = useRef(false);
  const prevValueRef = useRef(value);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    const el = elRef.current;
    if (!el) return;

    if (hasAnimatedRef.current) {
      prevValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        hasAnimatedRef.current = true;
        observer.disconnect();

        let startTime: number | null = null;
        const startValue = prevValueRef.current;
        prevValueRef.current = value;
        const raf = requestAnimationFrame(function tick(ts: number) {
          if (!startTime) startTime = ts;
          const elapsed = ts - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.floor(startValue + (value - startValue) * eased));
          if (progress < 1) requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, animate]);

  return <span ref={elRef}>{displayValue.toLocaleString()}</span>;
});

export default AnimatedCounter;
