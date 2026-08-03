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

  it('strips leading @ from instagram handle', () => {
    const url = gerarLinkWhatsApp('Ana', '@atelie_ana', 'BH', 1400);
    expect(url).not.toContain('@@');
    expect(url).toContain(encodeURIComponent('@atelie_ana'));
  });
});
