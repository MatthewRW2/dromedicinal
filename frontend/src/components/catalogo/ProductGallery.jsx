'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IconImage } from '@/components/icons';

/**
 * ProductGallery - Galería de imágenes para detalle de producto
 */
export default function ProductGallery({ images = [], productName = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <IconImage className="w-16 h-16 mx-auto mb-2" />
          <p>Sin imagen</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square relative overflow-hidden bg-white rounded-xl border border-gray-200">
        <Image
          src={selectedImage.path || selectedImage.url || selectedImage}
          alt={selectedImage.alt_text || `${productName} - Imagen ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative w-16 h-16 shrink-0
                rounded-lg overflow-hidden
                border-2 transition-all
                ${selectedIndex === index
                  ? 'border-brand-blue ring-2 ring-brand-blue/20'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.path || image.url || image}
                alt={image.alt_text || `${productName} - Miniatura ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
