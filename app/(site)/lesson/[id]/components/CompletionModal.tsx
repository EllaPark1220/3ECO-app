'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  volumeLabel: string;
  lessonTitle: string;
  volumeNumber: number; // 1 to 5
}

export default function CompletionModal({ isOpen, onClose, volumeLabel, lessonTitle, volumeNumber }: CompletionModalProps) {
  
  // Date format: YYYY.MM.DD (요일) HH:MM
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} (${['일', '월', '화', '수', '목', '금', '토'][now.getDay()]}) ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-white rounded-[22px] border-line-light shadow-[0_24px_48px_-16px_rgba(13,95,109,0.3)] p-8">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="font-serif font-semibold text-2xl text-text-main mb-2">학습 흔적</DialogTitle>
          <DialogDescription className="font-sans text-sm text-text-soft">
            오늘의 한 편을 마쳤습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center mb-8">
          {/* Mock shell/pearl using CSS */}
          <div className="w-32 h-32 mb-6 relative flex items-center justify-center bg-water-card rounded-full border border-line-soft">
             <div className={`pearl-base pearl-done pearl-vol-${volumeNumber} w-14 h-14`}></div>
          </div>
          
          <div className="font-mono text-[11px] text-accent-deep tracking-widest uppercase font-semibold mb-2">
            {volumeLabel}
          </div>
          <div className="font-serif font-semibold text-lg text-text-main text-center mb-4 leading-tight">
            {lessonTitle}
          </div>
          
          <div className="w-full h-px bg-line-soft mb-4"></div>
          
          <div className="text-sm text-text-mute font-mono">
            {dateStr}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/stamp-map" className="flex items-center justify-center w-full bg-accent-main hover:bg-accent-deep text-white font-medium py-6 rounded-xl transition-colors">
            스탬프 맵 보기
          </Link>
          <Button variant="outline" onClick={onClose} className="w-full border-line-light text-text-soft hover:bg-bg-light hover:text-text-main py-6 rounded-xl font-medium">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
