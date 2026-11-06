import type { StyleCommand } from './types';

export class CommandHistory {
  private undoStack: StyleCommand[] = [];
  private redoStack: StyleCommand[] = [];
  private maxHistory = 50;

  public execute(cmd: StyleCommand): void {
    if (!cmd.element || !cmd.element.isConnected) return;
    cmd.element.style.cssText = cmd.appliedCssText;
    this.undoStack.push(cmd);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;
  }

  public undo(): StyleCommand | null {
    const cmd = this.undoStack.pop();
    if (!cmd) return null;

    if (cmd.element && cmd.element.isConnected) {
      cmd.element.style.cssText = cmd.previousCssText;
    }
    this.redoStack.push(cmd);
    return cmd;
  }

  public redo(): StyleCommand | null {
    const cmd = this.redoStack.pop();
    if (!cmd) return null;

    if (cmd.element && cmd.element.isConnected) {
      cmd.element.style.cssText = cmd.appliedCssText;
    }
    this.undoStack.push(cmd);
    return cmd;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public getHistory(): readonly StyleCommand[] {
    return this.undoStack;
  }

  public getUniqueElementCount(): number {
    const uniqueElements = new Set<HTMLElement>();
    for (const cmd of this.undoStack) {
      if (cmd.element && cmd.element.isConnected) {
        uniqueElements.add(cmd.element);
      }
    }
    return uniqueElements.size;
  }

  public removeElement(el: HTMLElement): void {
    this.undoStack = this.undoStack.filter((cmd) => cmd.element !== el);
    this.redoStack = this.redoStack.filter((cmd) => cmd.element !== el);
  }

  public clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }
}
