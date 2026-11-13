// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSavedPosition,
  savePosition,
  clampToViewport,
  makeDraggable,
} from '../../src/draggable';

describe('Draggable Subsystem (Pointer Events & Clamping)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('safely handles getSavedPosition and savePosition with localStorage', () => {
    expect(getSavedPosition('test_key')).toBeNull();

    savePosition({ left: 120, top: 240 }, 'test_key');
    expect(getSavedPosition('test_key')).toEqual({ left: 120, top: 240 });

    localStorage.setItem('test_key', 'invalid json');
    expect(getSavedPosition('test_key')).toBeNull();

    localStorage.setItem('test_key', JSON.stringify({ left: 'not-number' }));
    expect(getSavedPosition('test_key')).toBeNull();
  });

  it('clamps target element within viewport boundaries', () => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.width = '100px';
    el.style.height = '40px';
    document.body.appendChild(el);

    // Mock window inner dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    // Negative coordinates should clamp to minimum margin (8px)
    el.style.left = '-50px';
    el.style.top = '-20px';
    const clamped1 = clampToViewport(el, 8);
    expect(clamped1.left).toBe(8);
    expect(clamped1.top).toBe(8);
    expect(el.style.left).toBe('8px');
    expect(el.style.top).toBe('8px');

    // Overflowing coordinates should clamp to window - width - margin
    el.style.left = '1500px';
    el.style.top = '1200px';
    // mock getBoundingClientRect
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      left: 1500,
      top: 1200,
      width: 100,
      height: 40,
      right: 1600,
      bottom: 1240,
      x: 1500,
      y: 1200,
      toJSON: () => {},
    });

    const clamped2 = clampToViewport(el, 8);
    expect(clamped2.left).toBe(1000 - 100 - 8); // 892
    expect(clamped2.top).toBe(800 - 40 - 8);   // 752
  });

  it('tracks pointer events, executes dragging beyond threshold, and suppresses subsequent click', () => {
    const target = document.createElement('div');
    target.style.position = 'fixed';
    target.style.left = '50px';
    target.style.top = '50px';
    const trigger = document.createElement('button');
    target.appendChild(trigger);
    document.body.appendChild(target);

    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 50,
      top: 50,
      width: 100,
      height: 40,
      right: 150,
      bottom: 90,
      x: 50,
      y: 50,
      toJSON: () => {},
    });

    trigger.setPointerCapture = vi.fn();
    trigger.releasePointerCapture = vi.fn();
    trigger.hasPointerCapture = vi.fn().mockReturnValue(true);

    const onDragEnd = vi.fn();
    const ctrl = makeDraggable(target, trigger, {
      margin: 8,
      storageKey: 'drag_test',
      onDragEnd,
    });

    // 1. Initial state
    expect(ctrl.wasJustDragged()).toBe(false);

    // 2. Pointer down
    const downEvent = new PointerEvent('pointerdown', {
      clientX: 50,
      clientY: 50,
      isPrimary: true,
      button: 0,
    });
    trigger.dispatchEvent(downEvent);
    // Pointer capture is deferred until movement threshold to avoid swallowing child clicks
    expect(trigger.setPointerCapture).not.toHaveBeenCalled();

    // 3. Pointer move below 4px threshold -> should not drag yet
    const microMove = new PointerEvent('pointermove', {
      clientX: 52,
      clientY: 51,
      isPrimary: true,
    });
    window.dispatchEvent(microMove);
    expect(target.classList.contains('dragging')).toBe(false);

    // 4. Pointer move beyond threshold -> should drag and capture pointer
    const moveEvent = new PointerEvent('pointermove', {
      clientX: 80,
      clientY: 90,
      isPrimary: true,
    });
    window.dispatchEvent(moveEvent);
    expect(trigger.setPointerCapture).toHaveBeenCalled();
    expect(target.classList.contains('dragging')).toBe(true);
    expect(trigger.classList.contains('dragging')).toBe(true);
    expect(target.style.left).toBe('80px');
    expect(target.style.top).toBe('90px');

    // 5. Pointer up -> finishes drag, updates storage, sets wasJustDragged
    const upEvent = new PointerEvent('pointerup', {
      clientX: 80,
      clientY: 90,
      isPrimary: true,
    });
    window.dispatchEvent(upEvent);
    expect(target.classList.contains('dragging')).toBe(false);
    expect(ctrl.wasJustDragged()).toBe(true);
    expect(onDragEnd).toHaveBeenCalled();
    expect(getSavedPosition('drag_test')).not.toBeNull();

    // 6. Cleanup
    ctrl.destroy();
  });
});
