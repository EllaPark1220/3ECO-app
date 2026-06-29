'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FontSizeToggle() {
  const [fontSize, setFontSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');

  useEffect(() => {
    const saved = localStorage.getItem('fontSize') as 'SMALL' | 'MEDIUM' | 'LARGE' | null;
    if (saved) {
      setFontSize(saved);
      applyFontSize(saved);
    }
  }, []);

  const applyFontSize = (size: 'SMALL' | 'MEDIUM' | 'LARGE') => {
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
    document.documentElement.classList.add(`font-${size.toLowerCase()}`);
  };

  const handleValueChange = (value: string | null) => {
    if (value === 'SMALL' || value === 'MEDIUM' || value === 'LARGE') {
      setFontSize(value);
      applyFontSize(value);
      localStorage.setItem('fontSize', value);
      // In a real app, we'd debounce this and save to backend (FW-AUTH-005)
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="font-size-toggle" className="text-sm font-medium text-text-soft">
        글자 크기 조절
      </label>
      <Select value={fontSize} onValueChange={handleValueChange}>
        <SelectTrigger id="font-size-toggle" className="w-[120px] bg-white border-line-light">
          <SelectValue placeholder="보통" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SMALL">작게 (16px)</SelectItem>
          <SelectItem value="MEDIUM">보통 (18px)</SelectItem>
          <SelectItem value="LARGE">크게 (20px)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
