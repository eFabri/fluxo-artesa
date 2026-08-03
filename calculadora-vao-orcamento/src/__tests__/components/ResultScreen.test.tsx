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
    expect(screen.getByRole('heading', { name: /Ana/ })).toBeInTheDocument();
  });

  it('renders the 3 door labels', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/Porta da Busca/i)).toBeInTheDocument();
    expect(screen.getByText(/Porta da Vitrine/i)).toBeInTheDocument();
    expect(screen.getByText(/Porta do Retorno/i)).toBeInTheDocument();
  });

  it('shows "Fechada" status text for each closed door', () => {
    render(<ResultScreen {...defaultProps} />);
    const fechadaEls = screen.getAllByText('Fechada');
    expect(fechadaEls).toHaveLength(3);
  });

  it('shows "Aberta" status text for each open door', () => {
    render(<ResultScreen {...defaultProps} portas={{ busca: true, vitrine: true, retorno: true }} />);
    const abertaEls = screen.getAllByText('Aberta');
    expect(abertaEls).toHaveLength(3);
  });

  it('shows door description for closed busca', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/não aparece quando alguém procura no Google/i)).toBeInTheDocument();
  });

  it('shows door description for open busca', () => {
    render(<ResultScreen {...defaultProps} portas={{ busca: true, vitrine: false, retorno: false }} />);
    expect(screen.getByText(/você aparece quando alguém procura no Google/i)).toBeInTheDocument();
  });

  it('renders CTA with correct href', () => {
    render(<ResultScreen {...defaultProps} />);
    const link = screen.getByRole('link', { name: /minha análise em vídeo/i });
    expect(link).toHaveAttribute('href', defaultProps.whatsappUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows "3 portas fechadas" copy when all 3 closed', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText(/as 3 portas do seu ateliê estão fechadas/i)).toBeInTheDocument();
  });

  it('shows "N portas fechadas" copy when 1-2 closed', () => {
    render(<ResultScreen {...defaultProps} portas={{ busca: false, vitrine: false, retorno: true }} />);
    expect(screen.getByText(/2 das suas portas estão fechadas/i)).toBeInTheDocument();
  });

  it('shows "bem encaminhadas" copy when 0-1 closed', () => {
    render(<ResultScreen {...defaultProps} portas={{ busca: true, vitrine: true, retorno: true }} />);
    expect(screen.getByText(/suas portas estão bem encaminhadas/i)).toBeInTheDocument();
  });
});
