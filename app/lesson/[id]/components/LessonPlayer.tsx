'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface LessonPlayerProps {
  youtubeVideoId: string;
  scriptContent: string;
}

export default function LessonPlayer({ youtubeVideoId, scriptContent }: LessonPlayerProps) {
  const [isTextMode, setIsTextMode] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-semibold text-2xl text-text-main">
          {isTextMode ? '글로 읽기' : '영상으로 시청하기'}
        </h2>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-line-light shadow-sm">
          <label htmlFor="media-toggle" className="text-sm font-medium text-text-soft cursor-pointer">
            글로 읽기
          </label>
          <Switch
            id="media-toggle"
            checked={isTextMode}
            onCheckedChange={setIsTextMode}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-line-soft bg-white shadow-sm transition-all duration-300">
        {!isTextMode ? (
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&modestbranding=1`}
              title="레슨 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <article className="p-8 md:p-12 prose prose-lg max-w-none font-sans text-text-main leading-loose">
            {/* Note: using dangerouslySetInnerHTML for prototype Markdown/HTML simulation */}
            <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
          </article>
        )}
      </div>
    </div>
  );
}
