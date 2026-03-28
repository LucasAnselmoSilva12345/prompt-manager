import { SidebarContent } from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const makeSut = () => {
  return render(<SidebarContent />);
};

describe('SidebarContent', () => {
  const user = userEvent.setup();

  it('should render a new prompt button', () => {
    makeSut();

    expect(screen.getByRole('complementary')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
  });

  describe('Collapsed / Expanded', () => {
    it('should start expanded and show the minimize button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /Minimizar sidebar/i,
      });
      expect(collapseButton).toBeVisible();

      const expandadButton = screen.queryByRole('button', {
        name: /Expandir sidebar/i,
      });
      expect(expandadButton).not.toBeInTheDocument();
    });

    it('should be contract and show expanded button', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /Minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const expandadButton = screen.queryByRole('button', {
        name: /Expandir sidebar/i,
      });
      expect(expandadButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe('New Prompt', () => {
    it('should redirect user to the new prompt page', async () => {
      makeSut();

      const newButton = screen.getByRole('button', { name: 'Novo prompt' });
      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });
});
