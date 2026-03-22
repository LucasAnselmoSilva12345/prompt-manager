import { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { ...options });
}

export * from '@testing-library/react';
export { customRender as render };
