'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Question {
  id: string;
  order: number;
  text: string;
  scrollAnchor: string;
}

interface OxQuizProps {
  questions: Question[];
  onComplete: () => void;
}

export default function OxQuiz({ questions, onComplete }: OxQuizProps) {
  const [answers, setAnswers] = useState<Record<string, 'O' | 'X'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'SUCCESS' | 'FAIL' | null>(null);

  const isAllAnswered = questions.length === Object.keys(answers).length;

  const handleAnswerChange = (questionId: string, value: 'O' | 'X') => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllAnswered) return;

    setIsSubmitting(true);
    setResult(null);

    // Mock API call
    setTimeout(() => {
      // Logic for demo: assume all O are correct, if any X is chosen, it fails.
      // (Do not expose correct answer to client)
      const isPass = Object.values(answers).every((val) => val === 'O');
      
      setIsSubmitting(false);
      
      if (isPass) {
        setResult('SUCCESS');
        onComplete();
      } else {
        setResult('FAIL');
        // Scroll to the first question anchor. Just for mock, anchor-1
        const element = document.getElementById(questions[0].scrollAnchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 500);
  };

  return (
    <Card className="p-8 mt-12 bg-white border-line-light shadow-sm rounded-2xl">
      <div className="mb-8">
        <h3 className="font-serif font-semibold text-xl text-text-main mb-2">이해 확인</h3>
        <p className="text-sm text-text-soft">배운 내용을 조용히 점검해 봅니다. 점수는 없습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div aria-live="polite" role="status" className="sr-only">
          {result === 'SUCCESS' && '이해 확인 완료.'}
          {result === 'FAIL' && '오답이 있습니다. 다시 학습 후 재제출하세요.'}
        </div>

        {questions.map((q) => (
          <fieldset key={q.id} id={q.scrollAnchor} className="border-b border-line-soft pb-8 last:border-0 last:pb-0">
            <legend className="font-medium text-text-main mb-4 text-[17px] leading-relaxed">
              <span className="text-accent-main font-semibold mr-2">Q{q.order}.</span>
              {q.text}
            </legend>
            <RadioGroup
              onValueChange={(val: string | null) => val && handleAnswerChange(q.id, val as 'O' | 'X')}
              value={answers[q.id]}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="O" id={`${q.id}-O`} className="w-6 h-6 border-line-light text-accent-main" />
                <label htmlFor={`${q.id}-O`} className="text-[17px] font-medium cursor-pointer">O (그렇다)</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="X" id={`${q.id}-X`} className="w-6 h-6 border-line-light text-accent-main" />
                <label htmlFor={`${q.id}-X`} className="text-[17px] font-medium cursor-pointer">X (아니다)</label>
              </div>
            </RadioGroup>
          </fieldset>
        ))}

        {result === 'SUCCESS' && (
          <div className="p-5 bg-water-card border border-water-mid rounded-xl text-center">
            <p className="font-medium text-accent-deep">이해 확인 완료</p>
          </div>
        )}

        {result === 'FAIL' && (
          <div className="p-5 bg-[#FFF5F5] border border-[#FFE0E0] rounded-xl text-center">
            <p className="font-medium text-[#D32F2F]">다시 학습 후 재제출하세요.</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={!isAllAnswered || isSubmitting || result === 'SUCCESS'}
            className="px-10 py-6 text-[16px] font-medium rounded-xl bg-accent-main hover:bg-accent-deep text-white transition-all shadow-md"
          >
            {isSubmitting ? '제출 중...' : result === 'SUCCESS' ? '완료됨' : '제출하기'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
