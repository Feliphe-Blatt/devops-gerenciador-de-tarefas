import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Home from './page';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as typeof fetch;
  globalThis.confirm = vi.fn(() => true) as typeof confirm;
});

describe('Home page', () => {
  it('renders the shell and metadata text', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('Taskflow Studio');
    expect(html).toContain('Projeto final DevOps');
  });
});