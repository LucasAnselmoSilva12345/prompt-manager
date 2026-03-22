import { render, screen } from '@/lib/test-utils';

describe('Example', () => {
  it('should be passed ', () => {
    render(<div>John Doe</div>);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
