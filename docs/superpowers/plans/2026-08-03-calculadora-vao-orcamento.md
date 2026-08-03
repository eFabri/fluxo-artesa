# Calculadora do Vão do Orçamento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a 7-question quiz SPA that calculates monthly revenue loss ("Vão do Orçamento") for maternity boutique owners and routes them to WhatsApp with a pre-filled message.

**Architecture:** Single `useReducer` drives all screen transitions (opening → questions → pre-renders → capture → result). No backend — 100% client-side. Framer Motion `AnimatePresence` wraps every screen swap for slide+fade transitions.

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS v3 + Framer Motion v11 + Lucide React + Vitest + React Testing Library

## Global Constraints

- Accent color is `--thread-gold: #B8934A` — never terracota `#D97757`
- Closed-door state uses `--stitch-brick: #B5503E`; open-door uses `--sage-open: #7C8B6F`
- All animations must have `prefers-reduced-motion` fallback (instant, no transition)
- Quiz body screens (P1-P7 + capture): background `--linen: #F4EFE6`; opening + result: `--ink-navy: #10131C`
- WhatsApp number: `5531986753530` (hardcoded, no env var needed)
- Fonts: Fraunces (display/headlines), Inter (body/UI), IBM Plex Mono (result number)
- All pre-render delays: 1500ms (P1-P6), 2500ms (P7 → capture transition)
- Project directory: `calculadora-vao-orcamento/` (subdirectory of current working dir)

---

## File Map

```
calculadora-vao-orcamento/
├── index.html                          # Google Fonts link tags
├── vite.config.ts                      # vitest config inline
├── tailwind.config.js                  # custom tokens
├── src/
│   ├── main.tsx
│   ├── App.tsx                         # useReducer, AnimatePresence, screen routing
│   ├── index.css                       # @tailwind directives + CSS vars
│   ├── test-setup.ts
│   ├── data/
│   │   ├── types.ts                    # shared interfaces
│   │   ├── questions.ts                # all 7 questions + pre-renders
│   │   └── calculation.ts             # calcularVao, calcularPortas, gerarLink
│   ├── quiz-reducer.ts                 # state machine
│   ├── hooks/
│   │   └── useReducedMotion.ts        # re-exports framer-motion's hook
│   ├── components/
│   │   ├── icons/
│   │   │   ├── DoorIcon.tsx           # SVG animated door (isOpen prop)
│   │   │   ├── NeedleIcon.tsx         # SVG animated needle (loading)
│   │   │   └── ChatBubbleIcon.tsx     # SVG animated chat bubble
│   │   ├── ProgressThread.tsx         # stroke-dasharray animated progress
│   │   ├── OpeningScreen.tsx          # ink-navy, img2 (Euler gesture), CTA
│   │   ├── QuestionCard.tsx           # question text + 4 option cards
│   │   ├── PreRender.tsx              # timed text overlay (auto-advances)
│   │   ├── CaptureFields.tsx          # nome / @instagram / cidade form
│   │   ├── ThreadNumber.tsx           # animated counter + stitching line
│   │   └── ResultScreen.tsx           # full result layout
│   └── __tests__/
│       ├── calculation.test.ts
│       ├── quiz-reducer.test.ts
│       └── components/
│           ├── ProgressThread.test.tsx
│           ├── OpeningScreen.test.tsx
│           ├── QuestionCard.test.tsx
│           ├── PreRender.test.tsx
│           ├── CaptureFields.test.tsx
│           ├── ThreadNumber.test.tsx
│           └── ResultScreen.test.tsx
```

---

### Task 1: Scaffold + Toolchain

**Files:**
- Create: `calculadora-vao-orcamento/` (via vite)
- Modify: `vite.config.ts`
- Modify: `tailwind.config.js`
- Modify: `index.html`
- Modify: `src/index.css`
- Create: `src/test-setup.ts`

**Interfaces:**
- Produces: working `npm run dev` and `npm run test` commands

- [ ] **Step 1: Scaffold project**

```bash
cd "/Users/alkmimsilva/Documents/Claude Code/fluxo-artesa"
npm create vite@latest calculadora-vao-orcamento -- --template react-ts
cd calculadora-vao-orcamento
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npm install framer-motion lucide-react
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx tailwindcss init -p
```

- [ ] **Step 2: Configure Tailwind**

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ink-navy':      '#10131C',
        'linen':         '#F4EFE6',
        'thread-gold':   '#B8934A',
        'stitch-brick':  '#B5503E',
        'sage-open':     '#7C8B6F',
        'charcoal-text': '#2B2620',
        'paper-white':   '#FDFCFA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Add Google Fonts to index.html**

Inside `<head>` before `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<title>Calculadora do Vão do Orçamento</title>
```

- [ ] **Step 4: Replace src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ink-navy:      #10131C;
  --linen:         #F4EFE6;
  --thread-gold:   #B8934A;
  --stitch-brick:  #B5503E;
  --sage-open:     #7C8B6F;
  --charcoal-text: #2B2620;
  --paper-white:   #FDFCFA;
}

html, body, #root {
  height: 100%;
  margin: 0;
}
```

- [ ] **Step 5: Configure Vitest in vite.config.ts**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

- [ ] **Step 6: Create src/test-setup.ts**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 7: Add types to tsconfig.json**

In `tsconfig.app.json` (or `tsconfig.json`), inside `compilerOptions`:
```json
"types": ["vitest/globals"]
```

- [ ] **Step 8: Verify toolchain**

```bash
npm run dev
# Should open on localhost:5173 — default Vite screen is fine
npm run test -- --run
# Should pass 0 tests with no errors
```

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold vite + tailwind + vitest"
```

---

### Task 2: Data Layer (TDD)

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/calculation.ts`
- Create: `src/data/questions.ts`
- Create: `src/__tests__/calculation.test.ts`

**Interfaces:**
- Produces: `calcularVao(p2, p3)`, `calcularPortas(p4, p5)`, `gerarLinkWhatsApp(...)`, `QUESTIONS` array, `Question` / `QuizOption` types

- [ ] **Step 1: Write types**

`src/data/types.ts`:
```ts
export interface QuizOption {
  id: string;
  label: string;
  value?: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  preRenders: Record<string, string> | string;
  icon?: 'chat' | 'needle';
}

export interface VaoResult {
  mensal: number;
  anual: number;
}

export interface PortasResult {
  busca: boolean;
  vitrine: boolean;
  retorno: boolean;
}

export interface CaptureData {
  nome: string;
  instagram: string;
  cidade: string;
}
```

- [ ] **Step 2: Write failing tests**

`src/__tests__/calculation.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { calcularVao, calcularPortas, gerarLinkWhatsApp } from '../data/calculation';

describe('calcularVao', () => {
  it('returns 0 when no orçamentos perdidos', () => {
    expect(calcularVao('nenhuma', '200_500')).toEqual({ mensal: 0, anual: 0 });
  });
  it('calculates mensal and anual correctly', () => {
    expect(calcularVao('4_a_10', '200_500')).toEqual({ mensal: 2450, anual: 29400 });
  });
  it('uses midpoint values', () => {
    expect(calcularVao('mais_de_10', 'acima_1000')).toEqual({ mensal: 14400, anual: 172800 });
  });
});

describe('calcularPortas', () => {
  it('all closed when not found on Google and no website', () => {
    expect(calcularPortas('so_concorrentes', 'link_bio')).toEqual({
      busca: false, vitrine: false, retorno: false,
    });
  });
  it('busca aberta when appears on Google', () => {
    expect(calcularPortas('meu_atelie', 'link_bio')).toEqual({
      busca: true, vitrine: false, retorno: false,
    });
  });
  it('vitrine and retorno aberta when has website', () => {
    expect(calcularPortas('so_concorrentes', 'site_proprio')).toEqual({
      busca: false, vitrine: true, retorno: true,
    });
  });
});

describe('gerarLinkWhatsApp', () => {
  it('encodes name, instagram, city and value into wa.me URL', () => {
    const url = gerarLinkWhatsApp('Ana', 'atelie_ana', 'BH', 2450);
    expect(url).toContain('wa.me/5531986753530');
    expect(url).toContain(encodeURIComponent('Ana'));
    expect(url).toContain(encodeURIComponent('@atelie_ana'));
    expect(url).toContain(encodeURIComponent('BH'));
    expect(url).toContain(encodeURIComponent('R$ 2450'));
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm run test -- --run src/__tests__/calculation.test.ts
```
Expected: "Cannot find module '../data/calculation'"

- [ ] **Step 4: Implement calculation.ts**

`src/data/calculation.ts`:
```ts
import type { VaoResult, PortasResult } from './types';

const P2: Record<string, number> = {
  nenhuma: 0, '1_a_3': 2, '4_a_10': 7, mais_de_10: 12, perdi_conta: 10,
};
const P3: Record<string, number> = {
  ate_200: 150, '200_500': 350, '500_1000': 750, acima_1000: 1200,
};

export function calcularVao(p2: string, p3: string): VaoResult {
  const mensal = (P2[p2] ?? 0) * (P3[p3] ?? 0);
  return { mensal, anual: mensal * 12 };
}

export function calcularPortas(p4: string, p5: string): PortasResult {
  const temSite = p5 === 'site_proprio';
  return {
    busca:   p4 === 'meu_atelie',
    vitrine: temSite,
    retorno: temSite,
  };
}

export function gerarLinkWhatsApp(
  nome: string,
  instagram: string,
  cidade: string,
  vaoMensal: number,
): string {
  const msg =
    `Oi, Euler! Sou ${nome}, do ateliê @${instagram}, de ${cidade}.\n\n` +
    `Acabei de fazer o diagnóstico e meu Vão do Orçamento deu R$ ${vaoMensal}/mês.\n\n` +
    `Quero receber minha análise em vídeo!`;
  return `https://wa.me/5531986753530?text=${encodeURIComponent(msg)}`;
}
```

- [ ] **Step 5: Write questions.ts**

`src/data/questions.ts`:
```ts
import type { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'p1',
    text: 'De onde vem a maior parte dos seus pedidos hoje?',
    options: [
      { id: 'indicacao',  label: 'Indicação de clientes' },
      { id: 'instagram',  label: 'Instagram / redes sociais' },
      { id: 'elo7',       label: 'Elo7 ou marketplace' },
      { id: 'sem_fluxo',  label: 'Não tenho fluxo definido' },
    ],
    preRenders: {
      indicacao:  'Anotado. Vamos ver o quanto isso custa te limitar.',
      instagram:  'Certo — vamos ver se isso realmente vira pedido.',
      elo7:       'Faz sentido. Muita gente perdeu esse canal em maio.',
      sem_fluxo:  'Isso explica muita coisa. Continue.',
    },
  },
  {
    id: 'p2',
    text: 'Nos últimos 30 dias, quantas clientes pediram orçamento e sumiram depois do preço?',
    options: [
      { id: 'nenhuma',      label: 'Nenhuma',        value: 0  },
      { id: '1_a_3',        label: '1 a 3',           value: 2  },
      { id: '4_a_10',       label: '4 a 10',          value: 7  },
      { id: 'mais_de_10',   label: 'Mais de 10',      value: 12 },
      { id: 'perdi_conta',  label: 'Perdi a conta',   value: 10 },
    ],
    preRenders: {
      nenhuma:     'Boa! Vamos ver se seu ticket também está saudável.',
      '1_a_3':     'Anotado. Seguindo.',
      '4_a_10':    'Isso já pesa. Seguindo.',
      mais_de_10:  'Ok. Isso vai pesar na conta final.',
      perdi_conta: 'Isso já é um sinal importante. Seguindo.',
    },
  },
  {
    id: 'p3',
    text: 'Qual o valor médio de um pedido seu?',
    options: [
      { id: 'ate_200',     label: 'Até R$ 200',        value: 150  },
      { id: '200_500',     label: 'R$ 200 a R$ 500',   value: 350  },
      { id: '500_1000',    label: 'R$ 500 a R$ 1.000', value: 750  },
      { id: 'acima_1000',  label: 'Acima de R$ 1.000', value: 1200 },
    ],
    preRenders: 'Calculando...',
    icon: 'needle',
  },
  {
    id: 'p4',
    text: 'Quando alguém pesquisa "enxoval personalizado + sua cidade" no Google, o que aparece?',
    options: [
      { id: 'meu_atelie',     label: 'Meu ateliê aparece' },
      { id: 'so_concorrentes', label: 'Só os concorrentes' },
      { id: 'nao_sei',        label: 'Não sei dizer' },
      { id: 'nunca_testei',   label: 'Nunca testei isso' },
    ],
    preRenders: {
      meu_atelie:      'Ótimo, essa porta já está aberta.',
      so_concorrentes: 'Essa é a Porta da Busca. Vamos ver as outras duas.',
      nao_sei:         'Grande parte das artesãs nunca testou isso. Seguindo.',
      nunca_testei:    'Grande parte das artesãs nunca testou isso. Seguindo.',
    },
  },
  {
    id: 'p5',
    text: 'Onde sua cliente vê seus modelos e preços hoje?',
    options: [
      { id: 'catalogo_whatsapp', label: 'Catálogo no WhatsApp' },
      { id: 'link_bio',          label: 'Link na bio do Instagram' },
      { id: 'uma_a_uma',         label: 'Mando foto a foto pra cada cliente' },
      { id: 'site_proprio',      label: 'Tenho site próprio' },
    ],
    preRenders: {
      catalogo_whatsapp: 'Você já tem vitrine. Só falta ver se ela tem porta pra rua.',
      link_bio:          'Você já tem vitrine. Só falta ver se ela tem porta pra rua.',
      uma_a_uma:         'Isso consome muito do seu tempo. Anotado.',
      site_proprio:      'Essa porta já está bem encaminhada.',
    },
  },
  {
    id: 'p6',
    text: 'Quanto tempo por dia você gasta respondendo orçamento no WhatsApp?',
    options: [
      { id: 'menos_30min', label: 'Menos de 30 minutos' },
      { id: '1_a_2h',      label: '1 a 2 horas' },
      { id: '3h_mais',     label: '3 horas ou mais' },
      { id: 'dia_todo',    label: 'O dia todo, praticamente' },
    ],
    preRenders: {
      menos_30min: 'Seguindo para a última pergunta.',
      '1_a_2h':    'Seguindo para a última pergunta.',
      '3h_mais':   'Isso é tempo que podia estar na máquina, não no celular.',
      dia_todo:    'Isso é tempo que podia estar na máquina, não no celular.',
    },
    icon: 'chat',
  },
  {
    id: 'p7',
    text: 'Qual seu faturamento médio nos últimos 3 meses?',
    options: [
      { id: 'ate_1000',   label: 'Até R$ 1.000' },
      { id: '1000_3000',  label: 'R$ 1.000 a R$ 3.000' },
      { id: '3000_8000',  label: 'R$ 3.000 a R$ 8.000' },
      { id: 'acima_8000', label: 'Acima de R$ 8.000' },
    ],
    preRenders: 'Última linha costurada. Montando seu diagnóstico...',
    icon: 'needle',
  },
];
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/calculation.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add src/data/ src/__tests__/calculation.test.ts
git commit -m "feat: data layer — questions, calculation, types"
```

---

### Task 3: Quiz Reducer (TDD)

**Files:**
- Create: `src/quiz-reducer.ts`
- Create: `src/__tests__/quiz-reducer.test.ts`

**Interfaces:**
- Consumes: `Question` from `./data/types`, `QUESTIONS` from `./data/questions`
- Produces: `QuizState`, `QuizAction`, `quizReducer(state, action)`

- [ ] **Step 1: Write failing tests**

`src/__tests__/quiz-reducer.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/quiz-reducer.test.ts
```

- [ ] **Step 3: Implement quiz-reducer.ts**

`src/quiz-reducer.ts`:
```ts
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/quiz-reducer.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/quiz-reducer.ts src/__tests__/quiz-reducer.test.ts
git commit -m "feat: quiz state machine — useReducer with all screen transitions"
```

---

### Task 4: Custom SVG Icons + useReducedMotion

**Files:**
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/components/icons/DoorIcon.tsx`
- Create: `src/components/icons/NeedleIcon.tsx`
- Create: `src/components/icons/ChatBubbleIcon.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`, `useReducedMotion`)
- Produces: `<DoorIcon isOpen />`, `<NeedleIcon />`, `<ChatBubbleIcon />`

- [ ] **Step 1: Create useReducedMotion hook**

`src/hooks/useReducedMotion.ts`:
```ts
export { useReducedMotion } from 'framer-motion';
```

- [ ] **Step 2: Implement DoorIcon**

`src/components/icons/DoorIcon.tsx`:
```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DoorIconProps {
  isOpen: boolean;
  size?: number;
}

export function DoorIcon({ isOpen, size = 48 }: DoorIconProps) {
  const reduce = useReducedMotion();
  const color = isOpen ? '#7C8B6F' : '#B5503E';

  // Closed: full rectangular frame  M4,22 L4,2 L20,2 L20,22 L4,22
  // Open:   frame missing bottom-right + ajar leaf  M4,22 L4,2 L20,2 L20,10 M20,22 L4,22 M14,12 L16,12
  const closedPath = 'M4 22 L4 2 L20 2 L20 22 L4 22';
  const openPath   = 'M4 22 L4 2 L20 2 L20 22 L4 22 M11 12 A1 1 0 1 0 11.01 12';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d={isOpen ? openPath : closedPath}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
      />
      {isOpen && (
        <motion.line
          x1="14" y1="6" x2="18" y2="18"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.8, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}
```

- [ ] **Step 3: Implement NeedleIcon**

`src/components/icons/NeedleIcon.tsx`:
```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function NeedleIcon({ size = 40 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* needle body */}
      <motion.path
        d="M12 3 L6 21"
        stroke="#B8934A"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {/* thread */}
      <motion.path
        d="M6 21 Q10 16 14 18 Q18 20 22 15"
        stroke="#B8934A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* eye of needle */}
      <circle cx="12" cy="4" r="1" fill="#B8934A" />
    </svg>
  );
}
```

- [ ] **Step 4: Implement ChatBubbleIcon**

`src/components/icons/ChatBubbleIcon.tsx`:
```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function ChatBubbleIcon({ size = 40 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <motion.path
        d="M4 4 H20 Q22 4 22 6 V14 Q22 16 20 16 H8 L4 20 V16 H4 Q2 16 2 14 V6 Q2 4 4 4 Z"
        stroke="#B8934A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: 'easeOut' }}
      />
      {/* dots */}
      {[8, 12, 16].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx} cy={10} r="1.2"
          fill="#B8934A"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.9 + i * 0.15, duration: 0.2 }}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 5: Verify visually**

Open `npm run dev`, temporarily render all 3 icons in `App.tsx` to confirm they draw correctly. Remove after check.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/ src/components/icons/
git commit -m "feat: custom SVG icons — Door, Needle, ChatBubble with pathLength animation"
```

---

### Task 5: ProgressThread

**Files:**
- Create: `src/components/ProgressThread.tsx`
- Create: `src/__tests__/components/ProgressThread.test.tsx`

**Interfaces:**
- Consumes: `currentStep: number`, `totalSteps: number`
- Produces: `<ProgressThread currentStep={2} totalSteps={8} />`

- [ ] **Step 1: Write failing test**

`src/__tests__/components/ProgressThread.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { ProgressThread } from '../../components/ProgressThread';

describe('ProgressThread', () => {
  it('renders an SVG', () => {
    const { container } = render(<ProgressThread currentStep={2} totalSteps={8} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('exposes progress ratio as data attribute', () => {
    const { container } = render(<ProgressThread currentStep={4} totalSteps={8} />);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset.progress).toBe('0.5');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/components/ProgressThread.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/ProgressThread.tsx`:
```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProgressThreadProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressThread({ currentStep, totalSteps }: ProgressThreadProps) {
  const reduce = useReducedMotion();
  const progress = currentStep / totalSteps;

  return (
    <div
      className="w-full px-6 pt-4"
      data-progress={progress}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemax={totalSteps}
    >
      <svg width="100%" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
        {/* background track */}
        <line
          x1="0" y1="6" x2="300" y2="6"
          stroke="#B8934A"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* animated progress thread */}
        <motion.line
          x1="0" y1="6" x2="300" y2="6"
          stroke="#B8934A"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
        />
        {/* needle dot at tip */}
        <motion.circle
          cy="6"
          r="3"
          fill="#B8934A"
          initial={{ cx: 0 }}
          animate={{ cx: progress * 300 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/components/ProgressThread.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressThread.tsx src/__tests__/components/ProgressThread.test.tsx
git commit -m "feat: ProgressThread — dashed animated SVG progress bar"
```

---

### Task 6: OpeningScreen

**Files:**
- Create: `src/components/OpeningScreen.tsx`
- Create: `src/__tests__/components/OpeningScreen.test.tsx`

**Interfaces:**
- Consumes: `onStart: () => void`
- Produces: `<OpeningScreen onStart={fn} />`

- [ ] **Step 1: Write failing test**

`src/__tests__/components/OpeningScreen.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpeningScreen } from '../../components/OpeningScreen';

describe('OpeningScreen', () => {
  it('renders the CTA button', () => {
    render(<OpeningScreen onStart={() => {}} />);
    expect(screen.getByRole('button', { name: /descobrir meu vão/i })).toBeInTheDocument();
  });

  it('calls onStart when button clicked', async () => {
    const onStart = vi.fn();
    render(<OpeningScreen onStart={onStart} />);
    await userEvent.click(screen.getByRole('button', { name: /descobrir meu vão/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/components/OpeningScreen.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/OpeningScreen.tsx`:
```tsx
import { motion } from 'framer-motion';

const IMG2 = 'https://res.cloudinary.com/def9lnal7/image/upload/v1785419996/ChatGPT_Image_30_de_jul._de_2026_10_59_00_3_qgsgnx.webp';

interface OpeningScreenProps {
  onStart: () => void;
}

export function OpeningScreen({ onStart }: OpeningScreenProps) {
  return (
    <div className="min-h-screen bg-ink-navy flex flex-col items-center justify-between px-6 py-10 text-white">
      {/* top: Euler image + brand */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 pt-4">
        <div className="relative w-64 h-64 overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={IMG2}
            alt="Euler Fabri"
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-semibold leading-tight">
            Quanto o seu ateliê está{' '}
            <em className="not-italic text-thread-gold">perdendo</em>{' '}
            todo mês?
          </h1>
          <p className="mt-3 font-body text-white/70 text-base leading-relaxed">
            7 perguntas. 2 minutos. Seu diagnóstico real de faturamento.
          </p>
        </motion.div>
      </div>

      {/* bottom: CTA */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <button
          onClick={onStart}
          className="w-full py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          Descobrir meu Vão do Orçamento
        </button>
        <p className="mt-3 text-center font-body text-white/40 text-xs">
          Gratuito · Sem cadastro · Resultado em 2 minutos
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/components/OpeningScreen.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/OpeningScreen.tsx src/__tests__/components/OpeningScreen.test.tsx
git commit -m "feat: OpeningScreen — ink-navy layout with Euler photo and CTA"
```

---

### Task 7: PreRender + QuestionCard

**Files:**
- Create: `src/components/PreRender.tsx`
- Create: `src/components/QuestionCard.tsx`
- Create: `src/__tests__/components/PreRender.test.tsx`
- Create: `src/__tests__/components/QuestionCard.test.tsx`

**Interfaces:**
- Consumes: `PreRender`: `text: string`, `icon?: 'needle'`, `onDone: () => void`, `delay?: number`
- Consumes: `QuestionCard`: `question: Question`, `stepLabel: string`, `onAnswer: (id: string) => void`, `onBack: () => void`
- Produces: `<PreRender text="..." onDone={fn} />`, `<QuestionCard question={q} ... />`

- [ ] **Step 1: Write failing tests**

`src/__tests__/components/PreRender.test.tsx`:
```tsx
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { PreRender } from '../../components/PreRender';

describe('PreRender', () => {
  it('renders the text', () => {
    vi.useFakeTimers();
    render(<PreRender text="Anotado. Seguindo." onDone={() => {}} />);
    expect(screen.getByText('Anotado. Seguindo.')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('calls onDone after delay', async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<PreRender text="msg" onDone={onDone} delay={1500} />);
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1500); });
    expect(onDone).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
```

`src/__tests__/components/QuestionCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionCard } from '../../components/QuestionCard';
import { QUESTIONS } from '../../data/questions';

describe('QuestionCard', () => {
  const q = QUESTIONS[0];

  it('renders question text', () => {
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={() => {}} />);
    expect(screen.getByText(q.text)).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={() => {}} />);
    q.options.forEach(o => {
      expect(screen.getByText(o.label)).toBeInTheDocument();
    });
  });

  it('calls onAnswer with option id when clicked', async () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={onAnswer} onBack={() => {}} />);
    await userEvent.click(screen.getByText(q.options[0].label));
    expect(onAnswer).toHaveBeenCalledWith(q.options[0].id);
  });

  it('calls onBack when back button clicked', async () => {
    const onBack = vi.fn();
    render(<QuestionCard question={q} stepLabel="1 de 7" onAnswer={() => {}} onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm run test -- --run "src/__tests__/components/(PreRender|QuestionCard).test.tsx"
```

- [ ] **Step 3: Implement PreRender**

`src/components/PreRender.tsx`:
```tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeedleIcon } from './icons/NeedleIcon';

interface PreRenderProps {
  text: string;
  icon?: 'needle';
  onDone: () => void;
  delay?: number;
}

export function PreRender({ text, icon, onDone, delay = 1500 }: PreRenderProps) {
  useEffect(() => {
    const t = setTimeout(onDone, delay);
    return () => clearTimeout(t);
  }, [onDone, delay]);

  return (
    <motion.div
      className="min-h-screen bg-linen flex flex-col items-center justify-center gap-6 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {icon === 'needle' && <NeedleIcon size={48} />}
      <p className="font-display text-xl text-charcoal-text text-center leading-snug max-w-xs">
        {text}
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 4: Implement QuestionCard**

`src/components/QuestionCard.tsx`:
```tsx
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import type { Question } from '../data/types';

interface QuestionCardProps {
  question: Question;
  stepLabel: string;
  onAnswer: (optionId: string) => void;
  onBack: () => void;
}

export function QuestionCard({ question, stepLabel, onAnswer, onBack }: QuestionCardProps) {
  return (
    <div className="min-h-screen bg-linen flex flex-col px-5 pt-6 pb-8">
      {/* step label */}
      <p className="font-body text-xs text-charcoal-text/40 uppercase tracking-widest mb-6">
        {stepLabel}
      </p>

      {/* question */}
      <div className="flex-1 flex flex-col">
        {question.icon === 'chat' && (
          <div className="mb-4">
            <ChatBubbleIcon size={36} />
          </div>
        )}
        <h2 className="font-display text-2xl font-semibold text-charcoal-text leading-snug mb-8">
          {question.text}
        </h2>

        {/* options */}
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => (
            <motion.button
              key={opt.id}
              onClick={() => onAnswer(opt.id)}
              className="w-full text-left px-5 py-4 bg-paper-white rounded-xl border border-charcoal-text/10 font-body text-charcoal-text text-base hover:border-thread-gold hover:bg-thread-gold/5 active:scale-98 transition-all duration-150"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* back */}
      <button
        onClick={onBack}
        aria-label="Voltar"
        className="flex items-center gap-1 font-body text-sm text-charcoal-text/40 hover:text-charcoal-text/70 mt-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Voltar
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm run test -- --run "src/__tests__/components/PreRender.test.tsx"
npm run test -- --run "src/__tests__/components/QuestionCard.test.tsx"
```

- [ ] **Step 6: Commit**

```bash
git add src/components/PreRender.tsx src/components/QuestionCard.tsx src/__tests__/components/
git commit -m "feat: PreRender auto-dismiss + QuestionCard with animated options"
```

---

### Task 8: CaptureFields

**Files:**
- Create: `src/components/CaptureFields.tsx`
- Create: `src/__tests__/components/CaptureFields.test.tsx`

**Interfaces:**
- Consumes: `onSubmit: (nome: string, instagram: string, cidade: string) => void`
- Produces: `<CaptureFields onSubmit={fn} />`

- [ ] **Step 1: Write failing test**

`src/__tests__/components/CaptureFields.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CaptureFields } from '../../components/CaptureFields';

describe('CaptureFields', () => {
  it('renders three input fields', () => {
    render(<CaptureFields onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/@seuatelie/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sua cidade/i)).toBeInTheDocument();
  });

  it('does not submit if fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<CaptureFields onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed values when all filled', async () => {
    const onSubmit = vi.fn();
    render(<CaptureFields onSubmit={onSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/seu nome/i), 'Ana');
    await userEvent.type(screen.getByPlaceholderText(/@seuatelie/i), 'atelie_ana');
    await userEvent.type(screen.getByPlaceholderText(/sua cidade/i), 'BH');
    await userEvent.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));
    expect(onSubmit).toHaveBeenCalledWith('Ana', 'atelie_ana', 'BH');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/components/CaptureFields.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/CaptureFields.tsx`:
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CaptureFieldsProps {
  onSubmit: (nome: string, instagram: string, cidade: string) => void;
}

export function CaptureFields({ onSubmit }: CaptureFieldsProps) {
  const [nome, setNome]           = useState('');
  const [instagram, setInstagram] = useState('');
  const [cidade, setCidade]       = useState('');
  const [touched, setTouched]     = useState(false);

  const valid = nome.trim() && instagram.trim() && cidade.trim();

  function handleSubmit() {
    setTouched(true);
    if (!valid) return;
    onSubmit(nome.trim(), instagram.trim(), cidade.trim());
  }

  const fieldClass = (val: string) =>
    `w-full px-4 py-3 rounded-xl border font-body text-charcoal-text bg-paper-white placeholder:text-charcoal-text/30 outline-none transition-colors ` +
    (touched && !val.trim()
      ? 'border-stitch-brick focus:border-stitch-brick'
      : 'border-charcoal-text/15 focus:border-thread-gold');

  return (
    <div className="min-h-screen bg-linen flex flex-col px-5 pt-10 pb-8">
      <p className="font-body text-xs text-charcoal-text/40 uppercase tracking-widest mb-6">
        Quase lá
      </p>
      <h2 className="font-display text-2xl font-semibold text-charcoal-text leading-snug mb-2">
        Só preciso de 3 coisas rápidas pra personalizar seu resultado.
      </h2>
      <p className="font-body text-sm text-charcoal-text/50 mb-8">
        Seus dados ficam só aqui — não são salvos em lugar nenhum.
      </p>

      <div className="flex flex-col gap-4 flex-1">
        {([
          { label: 'Seu nome', value: nome, setter: setNome, placeholder: 'Seu nome' },
          { label: 'Instagram do ateliê', value: instagram, setter: setInstagram, placeholder: '@seuatelie' },
          { label: 'Cidade', value: cidade, setter: setCidade, placeholder: 'Sua cidade' },
        ] as const).map(({ label, value, setter, placeholder }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <label className="block font-body text-sm text-charcoal-text/60 mb-1.5">{label}</label>
            <input
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              className={fieldClass(value)}
            />
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 w-full py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl hover:brightness-110 active:scale-95 transition-all duration-150"
      >
        Ver meu diagnóstico
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/components/CaptureFields.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CaptureFields.tsx src/__tests__/components/CaptureFields.test.tsx
git commit -m "feat: CaptureFields — nome / instagram / cidade with inline validation"
```

---

### Task 9: ThreadNumber

**Files:**
- Create: `src/components/ThreadNumber.tsx`
- Create: `src/__tests__/components/ThreadNumber.test.tsx`

**Interfaces:**
- Consumes: `mensal: number`, `anual: number`
- Produces: `<ThreadNumber mensal={2450} anual={29400} />`

- [ ] **Step 1: Write failing test**

`src/__tests__/components/ThreadNumber.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { ThreadNumber } from '../../components/ThreadNumber';

describe('ThreadNumber', () => {
  it('renders mensal value', () => {
    render(<ThreadNumber mensal={2450} anual={29400} />);
    expect(screen.getByTestId('mensal-value')).toBeInTheDocument();
  });

  it('renders anual value', () => {
    render(<ThreadNumber mensal={2450} anual={29400} />);
    expect(screen.getByTestId('anual-value')).toBeInTheDocument();
  });

  it('shows asterisk for estimation note', () => {
    render(<ThreadNumber mensal={2450} anual={29400} />);
    expect(screen.getByText(/estimativa/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/components/ThreadNumber.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/ThreadNumber.tsx`:
```tsx
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function AnimatedCounter({ target, reduce }: { target: number; reduce: boolean | null }) {
  const motionVal = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = formatBRL(target);
      return;
    }
    const controls = animate(motionVal, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: v => {
        if (ref.current) ref.current.textContent = formatBRL(Math.round(v));
      },
    });
    return controls.stop;
  }, [target, reduce, motionVal]);

  return <span ref={ref}>{formatBRL(0)}</span>;
}

interface ThreadNumberProps {
  mensal: number;
  anual: number;
}

export function ThreadNumber({ mensal, anual }: ThreadNumberProps) {
  const reduce = useReducedMotion();

  return (
    <div className="text-center">
      {/* stitching line above the number */}
      <div className="flex justify-center mb-2">
        <svg width="200" height="8" viewBox="0 0 200 8">
          <motion.line
            x1="0" y1="4" x2="200" y2="4"
            stroke="#B8934A"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <div
        className="font-mono text-4xl font-semibold text-stitch-brick leading-none"
        data-testid="mensal-value"
      >
        <AnimatedCounter target={mensal} reduce={reduce} />
        <span className="font-body text-lg text-charcoal-text/60">/mês</span>
      </div>

      <div
        className="mt-2 font-mono text-xl text-charcoal-text/50"
        data-testid="anual-value"
      >
        <AnimatedCounter target={anual} reduce={reduce} />
        <span className="font-body text-sm">/ano</span>
      </div>

      <p className="mt-3 font-body text-xs text-charcoal-text/35">
        *estimativa com base nas suas respostas
      </p>

      {/* stitching line below */}
      <div className="flex justify-center mt-2">
        <svg width="200" height="8" viewBox="0 0 200 8">
          <motion.line
            x1="0" y1="4" x2="200" y2="4"
            stroke="#B8934A"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.4, delay: 0.2, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/components/ThreadNumber.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreadNumber.tsx src/__tests__/components/ThreadNumber.test.tsx
git commit -m "feat: ThreadNumber — animated counter with stitching SVG lines"
```

---

### Task 10: ResultScreen

**Files:**
- Create: `src/components/ResultScreen.tsx`
- Create: `src/__tests__/components/ResultScreen.test.tsx`

**Interfaces:**
- Consumes: `nome: string`, `vao: VaoResult`, `portas: PortasResult`, `whatsappUrl: string`
- Produces: `<ResultScreen nome="Ana" vao={...} portas={...} whatsappUrl="..." />`

- [ ] **Step 1: Write failing test**

`src/__tests__/components/ResultScreen.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { ResultScreen } from '../../components/ResultScreen';

const defaultProps = {
  nome: 'Ana',
  vao: { mensal: 2450, anual: 29400 },
  portas: { busca: false, vitrine: false, retorno: false },
  whatsappUrl: 'https://wa.me/5531986753530?text=test',
};

describe('ResultScreen', () => {
  it('renders user name in heading', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/Ana/)).toBeInTheDocument();
  });

  it('renders the 3 door labels', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/Porta da Busca/i)).toBeInTheDocument();
    expect(screen.getByText(/Porta da Vitrine/i)).toBeInTheDocument();
    expect(screen.getByText(/Porta do Retorno/i)).toBeInTheDocument();
  });

  it('renders CTA with correct href', () => {
    render(<ResultScreen {...defaultProps} />);
    const link = screen.getByRole('link', { name: /minha análise em vídeo/i });
    expect(link).toHaveAttribute('href', defaultProps.whatsappUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows "portas fechadas" copy when 2+ closed', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/3 das suas 3 portas estão fechadas/i)).toBeInTheDocument();
  });

  it('shows "bem encaminhadas" copy when 0-1 closed', () => {
    render(<ResultScreen {...defaultProps} portas={{ busca: true, vitrine: true, retorno: true }} />);
    expect(screen.getByText(/suas portas estão bem encaminhadas/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/components/ResultScreen.test.tsx
```

- [ ] **Step 3: Implement**

`src/components/ResultScreen.tsx`:
```tsx
import { motion } from 'framer-motion';
import { ThreadNumber } from './ThreadNumber';
import { DoorIcon } from './icons/DoorIcon';
import type { VaoResult, PortasResult } from '../data/types';

const IMG1 = 'https://res.cloudinary.com/def9lnal7/image/upload/v1785419996/ChatGPT_Image_30_de_jul._de_2026_10_58_59_1_csqp3t.webp';

const PORTAS = [
  { key: 'busca'   as const, label: 'Porta da Busca'    },
  { key: 'vitrine' as const, label: 'Porta da Vitrine'  },
  { key: 'retorno' as const, label: 'Porta do Retorno'  },
];

interface ResultScreenProps {
  nome: string;
  vao: VaoResult;
  portas: PortasResult;
  whatsappUrl: string;
}

export function ResultScreen({ nome, vao, portas, whatsappUrl }: ResultScreenProps) {
  const fechadas = PORTAS.filter(p => !portas[p.key]).length;

  const closingCopy = fechadas >= 2
    ? `${nome}, seu ateliê está perdendo esse valor porque ${fechadas} das suas 3 portas estão fechadas.`
    : `${nome}, suas portas estão bem encaminhadas — o vazamento vem de outro lugar. Vale entender melhor onde.`;

  return (
    <div className="min-h-screen bg-ink-navy text-white flex flex-col items-center px-5 pt-10 pb-10">
      {/* heading */}
      <motion.h1
        className="font-display text-2xl font-semibold text-center mb-8 leading-snug"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {nome}, aqui está o seu diagnóstico
      </motion.h1>

      {/* vão do orçamento */}
      <motion.div
        className="w-full max-w-sm mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ThreadNumber mensal={vao.mensal} anual={vao.anual} />
      </motion.div>

      {/* 3 portas */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-4 mb-8">
        {PORTAS.map((p, i) => (
          <motion.div
            key={p.key}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
          >
            <DoorIcon isOpen={portas[p.key]} size={48} />
            <span className="font-body text-xs text-white/60 text-center leading-tight">{p.label}</span>
          </motion.div>
        ))}
      </div>

      {/* closing copy */}
      <motion.p
        className="font-body text-base text-white/80 text-center leading-relaxed max-w-xs mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        {closingCopy}
      </motion.p>

      {/* CTA */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm py-4 bg-thread-gold text-ink-navy font-body font-semibold text-lg rounded-xl text-center hover:brightness-110 active:scale-95 transition-all duration-150 block"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      >
        Quero minha análise em vídeo, grátis
      </motion.a>

      {/* footer: Euler signature */}
      <motion.div
        className="flex items-center gap-3 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <img
          src={IMG1}
          alt="Euler Fabri"
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover object-top border-2 border-thread-gold/30"
        />
        <div>
          <p className="font-body font-semibold text-sm text-white">Euler Fabri</p>
          <p className="font-body text-xs text-white/50 leading-snug">
            Especialista em Presença Digital<br />para Negócios
          </p>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm run test -- --run src/__tests__/components/ResultScreen.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultScreen.tsx src/__tests__/components/ResultScreen.test.tsx
git commit -m "feat: ResultScreen — vão number, 3 doors, dynamic copy, WhatsApp CTA"
```

---

### Task 11: App.tsx Integration + E2E Smoke Test

**Files:**
- Modify: `src/App.tsx`
- Create: `src/__tests__/App.test.tsx`

**Interfaces:**
- Consumes: all components + quiz-reducer + calculation
- Produces: fully wired SPA

- [ ] **Step 1: Write E2E smoke test**

`src/__tests__/App.test.tsx`:
```tsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

describe('App — full quiz flow', () => {
  it('walks through opening → all 7 questions → capture → result', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<App />);

    // Opening screen
    expect(screen.getByRole('button', { name: /descobrir meu vão/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /descobrir meu vão/i }));

    // Answer all 7 questions (pick first option each time, advance past pre-renders)
    for (let i = 0; i < 7; i++) {
      // Wait for question to appear
      const buttons = await screen.findAllByRole('button', { name: /voltar/i });
      expect(buttons.length).toBeGreaterThan(0);

      // Click first option
      const optionBtns = screen.getAllByRole('button').filter(b => b.textContent !== 'Voltar' && !b.textContent?.includes('Descobrir'));
      await userEvent.click(optionBtns[0]);

      // Advance past pre-render delay
      act(() => { vi.advanceTimersByTime(2600); });
    }

    // Capture fields
    expect(await screen.findByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText(/seu nome/i), 'Ana');
    await userEvent.type(screen.getByPlaceholderText(/@seuatelie/i), 'atelie_ana');
    await userEvent.type(screen.getByPlaceholderText(/sua cidade/i), 'BH');
    await userEvent.click(screen.getByRole('button', { name: /ver meu diagnóstico/i }));

    // Final pre-render
    act(() => { vi.advanceTimersByTime(2600); });

    // Result screen
    expect(await screen.findByText(/Ana, aqui está o seu diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /minha análise em vídeo/i })).toBeInTheDocument();

    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test -- --run src/__tests__/App.test.tsx
```

- [ ] **Step 3: Implement App.tsx**

`src/App.tsx`:
```tsx
import { useReducer, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { quizReducer, initialState } from './quiz-reducer';
import { QUESTIONS } from './data/questions';
import { calcularVao, calcularPortas, gerarLinkWhatsApp } from './data/calculation';
import { OpeningScreen }  from './components/OpeningScreen';
import { ProgressThread } from './components/ProgressThread';
import { QuestionCard }   from './components/QuestionCard';
import { PreRender }      from './components/PreRender';
import { CaptureFields }  from './components/CaptureFields';
import { ResultScreen }   from './components/ResultScreen';

const TOTAL_STEPS = QUESTIONS.length + 1; // 7 questions + capture

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0,  opacity: 1 },
  exit:  { x: -40, opacity: 0 },
};

export default function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const handleStart        = useCallback(() => dispatch({ type: 'START' }), []);
  const handleAnswer       = useCallback((optId: string) => {
    const q = QUESTIONS[state.questionIndex];
    dispatch({ type: 'ANSWER', questionId: q.id, value: optId });
  }, [state.questionIndex]);
  const handlePreRenderDone      = useCallback(() => dispatch({ type: 'PRERENDER_DONE' }), []);
  const handleFinalPreRenderDone = useCallback(() => dispatch({ type: 'FINAL_PRERENDER_DONE' }), []);
  const handleBack         = useCallback(() => dispatch({ type: 'BACK' }), []);
  const handleCapture      = useCallback((nome: string, instagram: string, cidade: string) => {
    dispatch({ type: 'CAPTURE_SUBMIT', nome, instagram, cidade });
  }, []);

  const currentQuestion = QUESTIONS[state.questionIndex];
  const isQuizScreen = state.screen === 'question' || state.screen === 'prerender' || state.screen === 'capture';

  // Compute result data (only used on result screen)
  const vao    = calcularVao(state.answers.p2 ?? 'nenhuma', state.answers.p3 ?? 'ate_200');
  const portas = calcularPortas(state.answers.p4 ?? 'so_concorrentes', state.answers.p5 ?? 'link_bio');
  const whatsappUrl = gerarLinkWhatsApp(
    state.capture.nome,
    state.capture.instagram,
    state.capture.cidade,
    vao.mensal,
  );

  const preRenderText = (() => {
    if (state.screen !== 'prerender') return '';
    const q = QUESTIONS[state.questionIndex];
    const lastAnswer = state.answers[q.id] ?? '';
    return typeof q.preRenders === 'string' ? q.preRenders : (q.preRenders[lastAnswer] ?? '');
  })();

  const preRenderIcon = state.screen === 'prerender' && currentQuestion?.icon === 'needle'
    ? 'needle' as const
    : undefined;

  const preRenderDelay = state.questionIndex === QUESTIONS.length - 1 ? 2500 : 1500;

  return (
    <div className="font-body overflow-hidden">
      {/* Progress bar — shown during quiz */}
      {isQuizScreen && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-linen">
          <ProgressThread
            currentStep={state.questionIndex + (state.screen === 'capture' ? 1 : 0)}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {state.screen === 'opening' && (
          <motion.div key="opening" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
            <OpeningScreen onStart={handleStart} />
          </motion.div>
        )}

        {state.screen === 'question' && (
          <motion.div key={`q-${state.questionIndex}`} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="pt-8">
            <QuestionCard
              question={currentQuestion}
              stepLabel={`${state.questionIndex + 1} de ${QUESTIONS.length}`}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {state.screen === 'prerender' && (
          <motion.div key={`pre-${state.questionIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <PreRender
              text={preRenderText}
              icon={preRenderIcon}
              onDone={handlePreRenderDone}
              delay={preRenderDelay}
            />
          </motion.div>
        )}

        {state.screen === 'capture' && (
          <motion.div key="capture" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="pt-8">
            <CaptureFields onSubmit={handleCapture} />
          </motion.div>
        )}

        {state.screen === 'prerender-final' && (
          <motion.div key="prerender-final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <PreRender
              text="Última linha costurada. Montando seu diagnóstico..."
              icon="needle"
              onDone={handleFinalPreRenderDone}
              delay={2500}
            />
          </motion.div>
        )}

        {state.screen === 'result' && (
          <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
            <ResultScreen
              nome={state.capture.nome}
              vao={vao}
              portas={portas}
              whatsappUrl={whatsappUrl}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Delete boilerplate from src/**

Remove `src/App.css` and `src/assets/react.svg`. Update `src/main.tsx` to remove any App.css import.

- [ ] **Step 5: Run all tests — expect PASS**

```bash
npm run test -- --run
```

- [ ] **Step 6: Manual walkthrough in browser**

```bash
npm run dev
```

Walk through: opening → answer all 7 questions → fill capture → see result → verify WhatsApp link opens correct message with name/instagram/city/value. Check animations, progress thread, door icons.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/__tests__/App.test.tsx
git commit -m "feat: wire App.tsx — full quiz flow with AnimatePresence transitions"
```

---

### Task 12: GitHub + Vercel Deploy

**Files:** none (infra only)

- [ ] **Step 1: Verify build passes**

```bash
npm run build
# Should complete with no TypeScript errors
```

- [ ] **Step 2: Push to GitHub**

```bash
# Inside calculadora-vao-orcamento/
gh repo create calculadora-vao-orcamento --public --source=. --push
# If gh not authenticated: gh auth login
```

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
# If not authenticated: npx vercel login
# Accept defaults: Vite project, `dist` output directory
```

- [ ] **Step 4: Note the live URL and verify**

Open the `.vercel.app` URL on mobile (or DevTools mobile emulation).
Check:
- Fonts load (Fraunces/Inter/IBM Plex Mono visible)
- Progress thread animates
- All 7 questions advance
- Result screen shows the correct WhatsApp link
- Tapping the CTA button opens WhatsApp

- [ ] **Step 5: Final commit with URL**

```bash
git tag v1.0.0
git push --tags
```
