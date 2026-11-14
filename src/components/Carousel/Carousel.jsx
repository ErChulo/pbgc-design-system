import React, { useRef } from 'react';
import { enhanceCarousel } from '../../behaviors/index.js';
import { useEnhance } from '../useEnhance.js';

/**
 * Carousel: a scroll-snap gallery with Previous/Next buttons and a "Slide n of N" status.
 * There is deliberately NO autoplay (WCAG 2.2.2) and no dot navigation (small targets, no names).
 * Off-screen slides are `inert`, so they leave the tab and reading order. Keyboard: Tab to the slides area
 * and use the Left/Right arrow keys, or use the buttons. Prefer Tabs or a Stepper when the content is a
 * sequence people need to compare or complete; use a carousel only for browsable, independent items.
 * slides: [{ id, content }]
 */
export function Carousel({ label, slides }) {
  const ref = useRef(null);
  useEnhance(ref, enhanceCarousel);
  return (
    <section ref={ref} className="pbgc-carousel" data-pbgc-carousel aria-roledescription="carousel" aria-label={label}>
      <div className="pbgc-carousel__track" tabIndex={0} role="group" aria-label={`${label}, slides`}>
        {slides.map((s, i) => (
          <div key={s.id} className="pbgc-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            {s.content}
          </div>
        ))}
      </div>
      <div className="pbgc-carousel__controls">
        <button type="button" className="pbgc-button pbgc-button--secondary" data-carousel-prev aria-disabled="true">Previous</button>
        <p className="pbgc-carousel__status" role="status" data-carousel-status />
        <button type="button" className="pbgc-button pbgc-button--secondary" data-carousel-next>Next</button>
      </div>
    </section>
  );
}
