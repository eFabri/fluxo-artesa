# Design Spec — Calculadora do Vão do Orçamento

**Data:** 2026-08-03  
**Produto:** Single Page App de diagnóstico financeiro para donas de ateliê de enxoval de maternidade  
**Stack:** React + Vite + TypeScript + Tailwind CSS + Framer Motion  
**Deploy:** Vercel (.vercel.app, subdomínio gratuito)

---

## Contexto

App chegado via link de WhatsApp (tráfego frio aquecido por Meta Ads). Não é formulário — é ferramenta. Faz 7 perguntas, calcula o "Vão do Orçamento" (perda financeira mensal estimada), mostra quais das 3 "portas" de vendas estão fechadas, e termina com CTA que abre WhatsApp do Euler Fabri com mensagem pré-preenchida.

---

## Design Tokens

```css
--ink-navy:      #10131C   /* telas de abertura e fechamento */
--linen:         #F4EFE6   /* fundo do miolo do quiz */
--thread-gold:   #B8934A   /* accent principal — "linha que costura" */
--stitch-brick:  #B5503E   /* porta fechada / alerta */
--sage-open:     #7C8B6F   /* porta aberta */
--charcoal-text: #2B2620   /* texto sobre linho */
--paper-white:   #FDFCFA   /* cards e superfícies elevadas */
```

**Proibido:** qualquer terracota próximo de `#D97757` (assinatura visual do Claude/Anthropic).

## Tipografia

| Uso | Fonte | Observação |
|-----|-------|-----------|
| Headlines / resultado | Fraunces | variable, peso 500-600; itálico só nas palavras-chave |
| Body / botões / UI | Inter | limpo, sem ruído |
| Número do resultado | IBM Plex Mono | contraste de "calculadora" contra o restante orgânico |

## Layout

- Single page, uma cena por viewport (sem scroll durante o quiz)
- Transição entre perguntas: slide horizontal + fade, 350-450ms, `AnimatePresence`
- Estrutura da cena:
  ```
  ┌─────────────────────────┐
  │ ░░░ barra de progresso ░│  ← traço tracejado dourado que avança
  │                          │
  │      [pergunta]          │
  │      [4 opções, cards]   │
  │                          │
  │         [voltar]         │  ← discreto, canto inferior esquerdo
  └─────────────────────────┘
  ```

## Elemento de Assinatura — "A Linha que Costura"

Traço SVG fino (thread-gold) com três momentos:

1. **Progresso:** traço tracejado animado via `stroke-dasharray` (não barra sólida)
2. **Número do Vão:** dígitos "costurados" na tela — `stroke-dashoffset` 0→1, ~1.2s, `easeOut`
3. **Portas:** ícones de linha única que se "fecham" ou "abrem" com traço se completando, staggered 0.15s

### Ícones SVG customizados (path único, 2px, animados via `pathLength` 0→1)

- Porta aberta / Porta fechada (usada 3×)
- Agulha/linha (loading da tela de cálculo)
- Balão de chat com "..." (pergunta do WhatsApp)

Ícones utilitários neutros (seta voltar, chevron): `lucide-react`.

## Imagens

| Arquivo | Conteúdo | Posicionamento |
|---------|----------|----------------|
| `img2.webp` (62K) | Euler, pose conversacional com gesto de mão | **Tela de abertura** — elemento secundário, fundo ink-navy |
| `img1.webp` (86K) | Euler, pose profissional em pé | **Tela de resultado** — círculo ~120px ao lado da assinatura |

Ambas já são WebP comprimidas pelo Cloudinary. Carregar com `loading="lazy"`.

---

## Arquitetura Técnica

```
Stack: React + Vite + TypeScript + Tailwind CSS + Framer Motion
Deploy: Vercel (.vercel.app)
Estado: único useReducer em App.tsx
Sem backend, sem banco — 100% client-side
```

### Estrutura de arquivos

```
/src
  /components
    OpeningScreen.tsx
    ProgressThread.tsx
    QuestionCard.tsx
    PreRender.tsx
    DoorIcon.tsx
    ThreadNumber.tsx
    ResultScreen.tsx
    CaptureFields.tsx
  /data
    questions.ts
    calculation.ts
  App.tsx
```

---

## Fluxo de Telas

```
OpeningScreen → P1 → P2 → P3 → [PreRender loading] → P4 → P5 → P6 → P7
  → CaptureFields (Nome / @Instagram / Cidade)
  → [PreRender "Montando diagnóstico..." 2-3s]
  → ResultScreen
```

---

## Perguntas e Pré-renders

### P1 — Origem dos pedidos
Opções: `indicacao` · `instagram` · `elo7` · `sem_fluxo`

| Resp. | Pré-render |
|-------|-----------|
| indicacao | "Anotado. Vamos ver o quanto isso custa te limitar." |
| instagram | "Certo — vamos ver se isso realmente vira pedido." |
| elo7 | "Faz sentido. Muita gente perdeu esse canal em maio." |
| sem_fluxo | "Isso explica muita coisa. Continue." |

### P2 — Orçamentos perdidos (valor numérico)
Opções: `nenhuma`=0 · `1_a_3`=2 · `4_a_10`=7 · `mais_de_10`=12 · `perdi_conta`=10

| Resp. | Pré-render |
|-------|-----------|
| nenhuma | "Boa! Vamos ver se seu ticket também está saudável." |
| 1_a_3 | "Anotado. Seguindo." |
| 4_a_10 | "Isso já pesa. Seguindo." |
| mais_de_10 | "Ok. Isso vai pesar na conta final." |
| perdi_conta | "Isso já é um sinal importante. Seguindo." |

### P3 — Ticket médio (valor numérico)
Opções: `ate_200`=150 · `200_500`=350 · `500_1000`=750 · `acima_1000`=1200

Pré-render fixo: "Calculando..." + animação agulha/linha 1.5s *(P2×P3 processado aqui, silenciosamente)*

### P4 — Visibilidade no Google
Opções: `meu_atelie` · `so_concorrentes` · `nao_sei` · `nunca_testei`

| Resp. | Pré-render |
|-------|-----------|
| meu_atelie | "Ótimo, essa porta já está aberta." |
| so_concorrentes | "Essa é a Porta da Busca. Vamos ver as outras duas." |
| nao_sei / nunca_testei | "Grande parte das artesãs nunca testou isso. Seguindo." |

### P5 — Vitrine
Opções: `catalogo_whatsapp` · `link_bio` · `uma_a_uma` · `site_proprio`

| Resp. | Pré-render |
|-------|-----------|
| catalogo_whatsapp / link_bio | "Você já tem vitrine. Só falta ver se ela tem porta pra rua." |
| uma_a_uma | "Isso consome muito do seu tempo. Anotado." |
| site_proprio | "Essa porta já está bem encaminhada." |

### P6 — Tempo no WhatsApp
Opções: `menos_30min` · `1_a_2h` · `3h_mais` · `dia_todo`

| Resp. | Pré-render |
|-------|-----------|
| menos_30min / 1_a_2h | "Seguindo para a última pergunta." |
| 3h_mais / dia_todo | "Isso é tempo que podia estar na máquina, não no celular." |

### P7 — Faturamento
Opções: `ate_1000` · `1000_3000` · `3000_8000` · `acima_8000`

Pré-render fixo: "Última linha costurada. Montando seu diagnóstico..." 2-3s com animação de assinatura.

### Captura (nome / @instagram / cidade)
Pré-render antes: "Só preciso de 3 coisas rápidas pra personalizar seu resultado."

---

## Lógica de Cálculo

```typescript
// Valores das faixas
const P2_VALUES = { nenhuma: 0, "1_a_3": 2, "4_a_10": 7, mais_de_10: 12, perdi_conta: 10 };
const P3_VALUES = { ate_200: 150, "200_500": 350, "500_1000": 750, acima_1000: 1200 };

// Vão do Orçamento
const mensal = P2_VALUES[p2] * P3_VALUES[p3];
const anual  = mensal * 12;

// 3 Portas
const busca   = p4 === "meu_atelie";
const vitrine = p5 === "site_proprio";
const retorno = p5 === "site_proprio";   // pixel só funciona em site
```

Nota de honestidade: asterisco discreto "*estimativa com base nas suas respostas" próximo ao número final.

---

## Tela de Resultado

1. `[Nome], aqui está o seu diagnóstico`
2. Número do Vão costurado — `R$ {mensal}/mês` grande, `R$ {anual}/ano` menor abaixo
3. As 3 Portas lado a lado (DoorIcon animado staggered):
   - Porta da Busca · Porta da Vitrine · Porta do Retorno
   - Aberta = sage-open · Fechada = stitch-brick
4. Frase dinâmica:
   - 2-3 fechadas: `"[Nome], seu ateliê está perdendo esse valor porque {N} das suas 3 portas estão fechadas."`
   - 0-1 fechada: `"[Nome], suas portas estão bem encaminhadas — o vazamento vem de outro lugar. Vale entender melhor onde."`
5. Botão CTA: **"Quero minha análise em vídeo, grátis"**
6. Rodapé: foto circular Euler (img1) + "Euler Fabri — Especialista em Presença Digital para Negócios"

### CTA — WhatsApp

```typescript
const numeroEuler = "5531986753530";

const mensagem = `Oi, Euler! Sou ${nome}, do ateliê @${instagram}, de ${cidade}.

Acabei de fazer o diagnóstico e meu Vão do Orçamento deu R$ ${vaoMensal}/mês.

Quero receber minha análise em vídeo!`;

const url = `https://wa.me/${numeroEuler}?text=${encodeURIComponent(mensagem)}`;
```

---

## Checklist de Animações

- [ ] Transição de perguntas: slide + fade, 350-450ms, `AnimatePresence`
- [ ] Barra de progresso: `stroke-dasharray` tracejado avançando
- [ ] Pré-renders: fade in 200ms + fade out 200ms, sem bounce
- [ ] Loading P3→P4: ícone agulha/linha em loop suave
- [ ] Número do resultado: `pathLength` 0→1, ~1.2s, `easeOut`
- [ ] Portas: traço completa na entrada, staggered 0.15s entre cada uma
- [ ] `prefers-reduced-motion`: fallback instantâneo para todas as animações acima

---

## Deploy

- GitHub: repositório público `calculadora-vao-orcamento`
- Vercel: import automático, subdomínio `.vercel.app` gratuito
- Sem backend, sem variáveis de ambiente necessárias
