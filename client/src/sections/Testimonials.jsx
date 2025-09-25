import React from 'react';

const TESTIMONIALS = [
  { id: 1, quote: 'The live ETAs are spot on. Makes commuting easy!', author: 'Prateek Chaturvedi' },
  { id: 2, quote: 'Simple and clean UI — love the map view.', author: 'Yashpal Singh' },
  { id: 3, quote: 'Finally know when to leave the house. Great app!', author: 'Sanjay Kumar Gupta' }

];

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center">What commuters say</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <figure
              key={t.id}
              className="rounded-2xl border border-gray-200 p-6 bg-gray-50 shadow-sm"
            >
              <blockquote className="text-lg text-gray-800 leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-gray-600 font-medium">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
