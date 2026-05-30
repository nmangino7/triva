'use client';

interface Props {
  text: string;
  category: string;
  difficulty: string;
  questionNumber: number;
  totalQuestions: number;
}

const DIFF_COLOR: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

export default function QuestionCard({ text, category, difficulty, questionNumber, totalQuestions }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-bold text-gray-400">
          {questionNumber} / {totalQuestions}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{category}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${DIFF_COLOR[difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
          {difficulty}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{text}</h2>
    </div>
  );
}
