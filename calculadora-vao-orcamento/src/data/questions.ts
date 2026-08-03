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
