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
            currentStep={state.questionIndex + 1}
            totalSteps={QUESTIONS.length}
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
