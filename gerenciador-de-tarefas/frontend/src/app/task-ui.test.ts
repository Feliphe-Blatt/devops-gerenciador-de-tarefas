import { describe, expect, it } from 'vitest';

import { getSubmitLabel, initialForm, statusClassName, statusLabels } from './task-ui';

describe('task-ui helpers', () => {
  it('exposes the expected status labels', () => {
    expect(statusLabels.PENDING).toBe('Pendente');
    expect(statusLabels.IN_PROGRESS).toBe('Em andamento');
    expect(statusLabels.DONE).toBe('Concluída');
  });

  it('exposes the expected status classes', () => {
    expect(statusClassName.PENDING).toContain('badge');
    expect(statusClassName.IN_PROGRESS).toContain('progress');
    expect(statusClassName.DONE).toContain('done');
  });

  it('exports the submit label helper for both modes', () => {
    expect(getSubmitLabel(null)).toBe('Criar tarefa');
    expect(getSubmitLabel(10)).toBe('Atualizar tarefa');
  });

  it('keeps a clean initial form state', () => {
    expect(initialForm).toEqual({
      title: '',
      description: '',
      status: 'PENDING'
    });
  });
});