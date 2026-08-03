import { QUESTIONS } from './data/questions';
import type { CaptureData } from './data/types';

export type Screen = 'opening' | 'question' | 'prerender' | 'capture' | 'prerender-final' | 'result';

export interface QuizState {
  screen: Screen;
  questionIndex: number;
  answers: Record<string, string>;
  capture: CaptureData;
}

export type QuizAction =
  | { type: 'START' }
  | { type: 'ANSWER'; questionId: string; value: string }
  | { type: 'PRERENDER_DONE' }
  | { type: 'CAPTURE_SUBMIT'; nome: string; instagram: string; cidade: string }
  | { type: 'FINAL_PRERENDER_DONE' }
  | { type: 'BACK' };

export const initialState: QuizState = {
  screen: 'opening',
  questionIndex: 0,
  answers: {},
  capture: { nome: '', instagram: '', cidade: '' },
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'question', questionIndex: 0 };

    case 'ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        screen: 'prerender',
      };

    case 'PRERENDER_DONE': {
      const isLast = state.questionIndex >= QUESTIONS.length - 1;
      if (isLast) return { ...state, screen: 'capture' };
      return { ...state, screen: 'question', questionIndex: state.questionIndex + 1 };
    }

    case 'CAPTURE_SUBMIT':
      return {
        ...state,
        capture: { nome: action.nome, instagram: action.instagram, cidade: action.cidade },
        screen: 'prerender-final',
      };

    case 'FINAL_PRERENDER_DONE':
      return { ...state, screen: 'result' };

    case 'BACK':
      if (state.questionIndex === 0) return { ...state, screen: 'opening' };
      return { ...state, screen: 'question', questionIndex: state.questionIndex - 1 };

    default:
      return state;
  }
}
