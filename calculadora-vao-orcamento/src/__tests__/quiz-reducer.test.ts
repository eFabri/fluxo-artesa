import { describe, it, expect } from 'vitest';
import { quizReducer, initialState } from '../quiz-reducer';

describe('quizReducer', () => {
  it('starts on opening screen', () => {
    expect(initialState.screen).toBe('opening');
  });

  it('START moves to first question', () => {
    const s = quizReducer(initialState, { type: 'START' });
    expect(s.screen).toBe('question');
    expect(s.questionIndex).toBe(0);
  });

  it('ANSWER saves answer and moves to prerender', () => {
    const s0 = quizReducer(initialState, { type: 'START' });
    const s1 = quizReducer(s0, { type: 'ANSWER', questionId: 'p1', value: 'indicacao' });
    expect(s1.answers['p1']).toBe('indicacao');
    expect(s1.screen).toBe('prerender');
  });

  it('PRERENDER_DONE advances to next question', () => {
    const s0 = quizReducer(initialState, { type: 'START' });
    const s1 = quizReducer(s0, { type: 'ANSWER', questionId: 'p1', value: 'indicacao' });
    const s2 = quizReducer(s1, { type: 'PRERENDER_DONE' });
    expect(s2.screen).toBe('question');
    expect(s2.questionIndex).toBe(1);
  });

  it('PRERENDER_DONE after last question moves to prerender-capture', () => {
    const state = {
      ...initialState,
      screen: 'prerender' as const,
      questionIndex: 6,
      answers: { p1:'indicacao', p2:'4_a_10', p3:'200_500', p4:'so_concorrentes', p5:'link_bio', p6:'1_a_2h', p7:'1000_3000' },
    };
    const next = quizReducer(state, { type: 'PRERENDER_DONE' });
    expect(next.screen).toBe('capture');
  });

  it('CAPTURE_SUBMIT saves data and moves to prerender-final', () => {
    const state = { ...initialState, screen: 'capture' as const };
    const next = quizReducer(state, {
      type: 'CAPTURE_SUBMIT',
      nome: 'Ana', instagram: 'atelie_ana', cidade: 'BH',
    });
    expect(next.capture.nome).toBe('Ana');
    expect(next.screen).toBe('prerender-final');
  });

  it('FINAL_PRERENDER_DONE moves to result', () => {
    const state = { ...initialState, screen: 'prerender-final' as const };
    const next = quizReducer(state, { type: 'FINAL_PRERENDER_DONE' });
    expect(next.screen).toBe('result');
  });

  it('BACK from question 1 goes to opening', () => {
    const state = { ...initialState, screen: 'question' as const, questionIndex: 0 };
    expect(quizReducer(state, { type: 'BACK' }).screen).toBe('opening');
  });

  it('BACK from question 3 goes to question 2', () => {
    const state = { ...initialState, screen: 'question' as const, questionIndex: 2 };
    const next = quizReducer(state, { type: 'BACK' });
    expect(next.questionIndex).toBe(1);
    expect(next.screen).toBe('question');
  });
});
