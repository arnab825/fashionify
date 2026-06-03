import React, { useState, useEffect, useRef, useCallback } from "react";

function PriceRangeSlider({ min, max, step = 1, value, onChange }) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className="w-full">
      <style>{`
        .slider-container {
          position: relative;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
        }
        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          z-index: 30;
          -webkit-appearance: none;
        }
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }
        .thumb::-webkit-slider-thumb {
          background-color: #ffffff;
          border: 3px solid #000000;
          border-radius: 50%;
          cursor: pointer;
          height: 24px;
          width: 24px;
          pointer-events: all;
          position: relative;
        }
        .thumb::-moz-range-thumb {
          background-color: #ffffff;
          border: 3px solid #000000;
          border-radius: 50%;
          cursor: pointer;
          height: 24px;
          width: 24px;
          pointer-events: all;
          position: relative;
        }
        .thumb:focus::-webkit-slider-thumb {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }
      `}</style>

      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - step);
            setMinVal(value);
            minValRef.current = value;
            onChange([value, maxVal]);
          }}
          className="thumb"
          style={{ zIndex: minVal > max - 100 ? 40 : 30 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + step);
            setMaxVal(value);
            maxValRef.current = value;
            onChange([minVal, value]);
          }}
          className="thumb"
          style={{ zIndex: 35 }}
        />

        <div className="relative w-full h-2 border-2 border-black rounded-full overflow-hidden z-10 bg-muted">
          <div
            ref={range}
            className="absolute h-full bg-[hsl(var(--primary))] z-20 transition-all duration-150 ease-out"
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 font-display font-black">
        <div className="text-sm bg-card border-2 border-black px-3 py-1 rounded-sm shadow-[2px_2px_0px_0px_hsl(var(--neu-black))]">
          ₹{minVal}
        </div>
        <div className="text-sm text-muted-foreground font-bold">TO</div>
        <div className="text-sm bg-card border-2 border-black px-3 py-1 rounded-sm shadow-[2px_2px_0px_0px_hsl(var(--neu-black))]">
          ₹{maxVal}
        </div>
      </div>
    </div>
  );
}

export default PriceRangeSlider;
