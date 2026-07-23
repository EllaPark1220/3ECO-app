'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface LessonNode {
  id: string;
  volumeNumber: number;
  order: number;
  title: string;
  isCompleted: boolean;
}

interface StampMapProps {
  nodes: LessonNode[];
}

export default function StampMap({ nodes }: StampMapProps) {
  const completedCount = nodes.filter(n => n.isCompleted).length;

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-text-main mb-4">학습의 흔적</h1>
        <p className="font-sans text-text-soft">
          {nodes.length}편 중 {completedCount}편 학습 완료
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {nodes.map((node) => (
          <Link key={node.id} href={`/lesson/${node.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-accent-main rounded-[18px]">
              <Card className="p-6 h-full flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-lg border-line-light bg-white/80 backdrop-blur-sm group cursor-pointer">
                
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-water-card border border-line-soft transition-colors group-hover:border-accent-soft">
                  <div 
                    className={`pearl-base w-8 h-8 ${
                      node.isCompleted 
                        ? `pearl-done pearl-vol-${node.volumeNumber}` 
                        : `pearl-todo pearl-vol-${node.volumeNumber}`
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <div className="font-mono text-[10px] text-text-mute mb-2">
                  {node.volumeNumber}권 {node.order}편
                </div>
                
                <h3 className="font-serif font-medium text-sm text-text-main leading-snug">
                  {node.title}
                </h3>
                
                <div className="mt-3 text-[11px] font-medium text-text-soft">
                  {node.isCompleted ? '학습함' : '미학습'}
                </div>
                
              </Card>
          </Link>
        ))}
      </div>

      {completedCount === 0 && (
        <div className="mt-20 p-8 text-center bg-white/60 backdrop-blur-md rounded-2xl max-w-lg mx-auto border border-line-light">
          <p className="font-sans text-text-main font-medium">첫 레슨을 선택해 시작하세요.</p>
        </div>
      )}
    </div>
  );
}
