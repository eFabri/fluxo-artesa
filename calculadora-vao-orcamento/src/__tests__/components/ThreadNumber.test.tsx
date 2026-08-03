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
