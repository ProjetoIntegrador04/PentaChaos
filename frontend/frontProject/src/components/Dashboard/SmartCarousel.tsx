import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./SmartCarousel.css";

type Item = {
  key: string;
  title: string;
  subtitle?: string;
  color?: string;
};

type Props = {
  items: Item[];
  windowSize?: number;                
  onActiveChange?: (key: string) => void;
  onNavigate?: (key: string) => void;
};

export default function SmartCarousel({
  items,
  windowSize = 3,
  onActiveChange,
  onNavigate,
}: Props) {
  const [start, setStart] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const maxStart = Math.max(0, items.length - windowSize);
  const end = Math.min(start + windowSize, items.length);
  const visible = items.slice(start, end);

  React.useEffect(() => {
    const key = items[activeIndex]?.key;
    if (key) onActiveChange?.(key);
  }, [activeIndex, items, onActiveChange]);

  React.useEffect(() => {
    if (activeIndex < start || activeIndex >= end) {
      setActiveIndex(start);
    }
  }, [start, end, activeIndex]);

  const prev = () => {
    if (start === 0) return;
    setStart((s) => Math.max(0, s - 1));     
  };

  const next = () => {
    if (start >= maxStart) return;
    setStart((s) => Math.min(maxStart, s + 1)); 
  };

  const setActiveFromVisible = (localIdx: number) => {
    const globalIdx = start + localIdx;
    setActiveIndex(globalIdx);
  };

  return (
    <div className="sc-wrap sc-wrap--window">
      <button
        className="sc-arrow left"
        aria-label="Anterior"
        onClick={prev}
        disabled={start === 0}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="sc-viewport sc-viewport--window">
        {visible.map((it, i) => {
          const globalIdx = start + i;
          const isActive = globalIdx === activeIndex;
          return (
            <div key={it.key} className="sc-card-outer">
              <button
                className={`sc-card ${isActive ? "active" : ""}`}
                style={{ borderColor: it.color ?? "#3b82f6" }}
                onClick={() => setActiveFromVisible(i)}
                title="Selecionar squad"
              >
                <div className="sc-title">{it.title}</div>
                {!!it.subtitle && <div className="sc-sub">{it.subtitle}</div>}
              </button>

              <button
                className="sc-go"
                onClick={() => onNavigate?.(it.key)}
                title="Ir para a página do squad"
              >
                Ver squad →
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="sc-arrow right"
        aria-label="Próximo"
        onClick={next}
        disabled={start >= maxStart}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
