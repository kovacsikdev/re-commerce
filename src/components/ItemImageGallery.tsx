'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { resolveImageSrc } from '../lib/helpers';

const ThreeModelViewer = dynamic(
  () => import('./ThreeModelViewer').then((mod) => mod.ThreeModelViewer),
  {
    ssr: false,
  },
);

type GalleryEntry =
  | { type: 'image'; url: string }
  | { type: 'model'; url: string };

type ItemImageGalleryProps = {
  itemId: string;
  itemName: string;
  heroImageUrl: string;
  galleryImageUrls: string[];
  modelUrl?: string;
};

export const ItemImageGallery = ({
  itemId,
  itemName,
  heroImageUrl,
  galleryImageUrls,
  modelUrl,
}: ItemImageGalleryProps) => {
  const [activeEntry, setActiveEntry] = useState<GalleryEntry | null>(null);
  const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);

  const galleryImages = useMemo(
    () => [heroImageUrl, ...galleryImageUrls].filter((url, index, array) => Boolean(url) && array.indexOf(url) === index),
    [galleryImageUrls, heroImageUrl],
  );

  const galleryEntries: GalleryEntry[] = useMemo(
    () => [
      { type: 'image', url: galleryImages[0] },
      ...(modelUrl ? [{ type: 'model' as const, url: modelUrl }] : []),
      ...galleryImages.slice(1).map((url) => ({ type: 'image' as const, url })),
    ],
    [galleryImages, modelUrl],
  );

  useEffect(() => {
    setActiveEntry({ type: 'image', url: heroImageUrl });
    setIsModelViewerOpen(false);
  }, [heroImageUrl, itemId]);

  const selectedEntry =
    activeEntry && galleryEntries.some((entry) => entry.type === activeEntry.type && entry.url === activeEntry.url)
      ? activeEntry
      : galleryEntries[0];

  const selectedImage = selectedEntry?.type === 'image' ? selectedEntry.url : galleryImages[0];
  const isModelSelected = selectedEntry?.type === 'model';

  const setGalleryPreview = (entry: GalleryEntry) => {
    setActiveEntry(entry);
    setIsModelViewerOpen(false);
  };

  return (
    <div className="img-gallery-wrapper">
      <div className="img-gallery-thumbnails">
        {galleryEntries.map((entry, index) => (
          <button
            key={`${itemId}-${entry.type}-${entry.url}-${index}`}
            type="button"
            className={`thumbnail-button ${selectedEntry?.type === entry.type && selectedEntry.url === entry.url ? 'is-active' : ''} ${entry.type === 'model' ? 'thumbnail-button--model' : ''}`}
            aria-label={entry.type === 'model' ? `Preview 3D model for ${itemName}` : `Preview image ${index + 1} for ${itemName}`}
            onMouseEnter={() => setGalleryPreview(entry)}
            onFocus={() => setGalleryPreview(entry)}
            onClick={() => setGalleryPreview(entry)}
          >
            {entry.type === 'model' ? (
              <span className="thumbnail-model-label">3D</span>
            ) : (
              <img
                className="img-thumbnail-item"
                src={resolveImageSrc(entry.url)}
                alt={`${itemName} preview ${index + 1}`}
              />
            )}
          </button>
        ))}
      </div>

      <div className="img-gallery-preview">
        {isModelSelected && selectedEntry ? (
          isModelViewerOpen ? (
            <ThreeModelViewer modelUrl={resolveImageSrc(selectedEntry.url)} itemName={itemName} />
          ) : (
            <button
              type="button"
              className="model-preview-launch"
              onClick={() => setIsModelViewerOpen(true)}
            >
              <img
                className="img-hero-item img-hero-item--dimmed"
                src={resolveImageSrc(heroImageUrl)}
                alt={itemName}
              />
              <span className="model-preview-overlay">Click to view the item in 3D</span>
            </button>
          )
        ) : (
          <a
            href={selectedImage}
            target="_blank"
            rel="noopener noreferrer"
            className="img-hero-popover-link"
          >
            <img
              className="img-hero-item"
              src={resolveImageSrc(selectedImage)}
              alt={itemName}
            />
          </a>
        )}
      </div>
    </div>
  );
};