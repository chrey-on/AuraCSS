// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { CommandHistory } from '../../src/command';
import type { StyleCommand } from '../../src/types';

describe('CommandHistory (GoF Undo/Redo Engine)', () => {
  let history: CommandHistory;
  let targetEl: HTMLElement;

  beforeEach(() => {
    history = new CommandHistory();
    targetEl = document.createElement('button');
    targetEl.style.cssText = 'color: black;';
    document.body.appendChild(targetEl);
  });

  it('executes commands and tracks undo/redo stacks', () => {
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);

    const cmd1: StyleCommand = {
      element: targetEl,
      selectorPath: 'button',
      previousCssText: 'color: black;',
      appliedCssText: 'color: red;',
      tailwindClasses: 'text-red-500',
      timestamp: Date.now(),
    };

    history.execute(cmd1);
    expect(targetEl.style.color).toBe('red');
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);

    // Undo
    const undone = history.undo();
    expect(undone).toBe(cmd1);
    expect(targetEl.style.color).toBe('black');
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(true);

    // Redo
    const redone = history.redo();
    expect(redone).toBe(cmd1);
    expect(targetEl.style.color).toBe('red');
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
  });

  it('clears redo stack when a new command is executed after undo', () => {
    history.execute({
      element: targetEl,
      selectorPath: 'button',
      previousCssText: 'color: black;',
      appliedCssText: 'color: red;',
      tailwindClasses: 'text-red-500',
      timestamp: 1,
    });

    history.undo();
    expect(history.canRedo()).toBe(true);

    history.execute({
      element: targetEl,
      selectorPath: 'button',
      previousCssText: 'color: black;',
      appliedCssText: 'color: blue;',
      tailwindClasses: 'text-blue-500',
      timestamp: 2,
    });

    expect(history.canRedo()).toBe(false);
    expect(targetEl.style.color).toBe('blue');
  });

  it('accurately reports unique modified elements count', () => {
    const el2 = document.createElement('div');
    document.body.appendChild(el2);

    expect(history.getUniqueElementCount()).toBe(0);

    // Apply preset 1 to targetEl
    history.execute({
      element: targetEl,
      selectorPath: 'button',
      previousCssText: 'color: black;',
      appliedCssText: 'color: red;',
      tailwindClasses: 'text-red-500',
      timestamp: 1,
    });
    expect(history.getUniqueElementCount()).toBe(1);

    // Apply preset 2 to the same targetEl -> count should still be 1!
    history.execute({
      element: targetEl,
      selectorPath: 'button',
      previousCssText: 'color: red;',
      appliedCssText: 'color: blue;',
      tailwindClasses: 'text-blue-500',
      timestamp: 2,
    });
    expect(history.getUniqueElementCount()).toBe(1);

    // Apply preset to el2 -> count becomes 2
    history.execute({
      element: el2,
      selectorPath: 'div',
      previousCssText: '',
      appliedCssText: 'padding: 10px;',
      tailwindClasses: 'p-2',
      timestamp: 3,
    });
    expect(history.getUniqueElementCount()).toBe(2);

    // Undo el2 -> count drops back to 1
    history.undo();
    expect(history.getUniqueElementCount()).toBe(1);
  });
});
