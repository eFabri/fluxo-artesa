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
