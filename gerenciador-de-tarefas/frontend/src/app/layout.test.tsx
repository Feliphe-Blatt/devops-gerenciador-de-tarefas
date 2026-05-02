import { create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./globals.css', () => ({}));
vi.mock('next/font/google', () => ({
  Space_Grotesk: () => ({ variable: '--font-space-grotesk' })
}));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders the html shell with the expected locale', () => {
    const renderer = create(
      <RootLayout>
        <div>Conteudo</div>
      </RootLayout>
    );

    const tree = renderer.toJSON();
    expect(JSON.stringify(tree)).toContain('Conteudo');
    expect(JSON.stringify(tree)).toContain('pt-BR');
  });
});