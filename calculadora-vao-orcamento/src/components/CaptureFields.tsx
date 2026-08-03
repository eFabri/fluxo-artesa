import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CaptureFieldsProps {
  onSubmit: (nome: string, instagram: string, cidade: string) => void;
}

export function CaptureFields({ onSubmit }: CaptureFieldsProps) {
  const [nome, setNome]           = useState('');
  const [instagram, setInstagram] = useState('');
  const [cidade, setCidade]       = useState('');
  const [touched, setTouched]     = useState(false);
  const reduce = useReducedMotion();

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
        {/* Nome */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0, duration: 0.3 } })}
        >
          <label htmlFor="capture-nome" className="block font-body text-sm text-charcoal-text/60 mb-1.5">
            Seu nome
          </label>
          <input
            id="capture-nome"
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            className={fieldClass(nome)}
          />
        </motion.div>

        {/* Instagram */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1, duration: 0.3 } })}
        >
          <label htmlFor="capture-instagram" className="block font-body text-sm text-charcoal-text/60 mb-1.5">
            Instagram do ateliê
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 rounded-l-xl border border-r-0 border-charcoal-text/15 bg-paper-white font-body text-charcoal-text/50 select-none">
              @
            </span>
            <input
              id="capture-instagram"
              type="text"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="@seuatelie"
              className={`${fieldClass(instagram)} rounded-l-none`}
            />
          </div>
        </motion.div>

        {/* Cidade */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.3 } })}
        >
          <label htmlFor="capture-cidade" className="block font-body text-sm text-charcoal-text/60 mb-1.5">
            Cidade
          </label>
          <input
            id="capture-cidade"
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            placeholder="Sua cidade"
            className={fieldClass(cidade)}
          />
        </motion.div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={touched && !valid}
        className={`mt-8 w-full py-4 font-body font-semibold text-lg rounded-xl transition-all duration-150 ${
          touched && !valid
            ? 'bg-charcoal-text/20 text-charcoal-text/40 cursor-not-allowed'
            : 'bg-thread-gold text-ink-navy hover:brightness-110 active:scale-95'
        }`}
      >
        Ver meu diagnóstico
      </button>
    </div>
  );
}
