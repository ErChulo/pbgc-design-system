import React from 'react';
import { Carousel } from './Carousel.jsx';

export default { title: 'Organisms/Carousel', component: Carousel, parameters: { layout: 'padded' } };

export const Default = {
  args: {
    label: 'Sample items',
    slides: ['one', 'two', 'three'].map((w, i) => ({ id: w, content: (<><h3>Sample slide {i + 1}</h3><p>Sample content for slide {w}. There is no autoplay; people move between slides themselves.</p></>) })),
  },
};
