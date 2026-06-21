import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return <div className="aspect-[16/9] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">No photos</div>;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
        <img
          src={images[current].url}
          alt={`Photo ${current + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Expand size={16} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === current ? 'border-blue-500' : 'border-transparent'}`}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(false)}>
            <X size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white bg-black/50 rounded-full p-3">
            <ChevronLeft size={28} />
          </button>
          <img
            src={images[current].url}
            alt=""
            className="max-h-screen max-w-screen-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white bg-black/50 rounded-full p-3">
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}
