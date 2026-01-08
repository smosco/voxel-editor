import type { Command } from '@voxel-editor/shared-types';

/**
 * Command Pattern 기반 History Manager
 *
 * Command 스택과 포인터를 사용하여 Undo/Redo 관리
 * - commandsHistory: 실행된 모든 Command 저장
 * - currentCommandPointer: 현재 위치 (-1부터 시작)
 * - 새 Command 실행 시 forward stack 자동 제거
 *
 * Reference FigureChangesManager
 */
export class CommandManager {
  private commandsHistory: Command[] = [];
  private currentCommandPointer = -1;

  /**
   * 새 Command 실행 및 history에 추가
   * 1. forward stack 제거 (clearForwards)
   * 2. history에 추가
   * 3. pointer 업데이트
   * 4. command.execute(true) 실행
   */
  executeCommand(command: Command): void {
    this.clearForwards();
    this.commandsHistory.push(command);
    this.updateCommandPointer();

    const currentCommand = this.commandsHistory[this.currentCommandPointer];
    if (currentCommand) {
      currentCommand.execute(true);
    }
  }

  /**
   * Redo 실행
   * pointer를 앞으로 이동하고 execute(false) 호출
   */
  forward(): void {
    if (this.canForward()) {
      this.currentCommandPointer++;
      const command = this.commandsHistory[this.currentCommandPointer];
      if (command) {
        command.execute(false);
      }
    }
  }

  /**
   * Undo 실행
   * 현재 Command의 undo() 호출 후 pointer를 뒤로 이동
   */
  backward(): void {
    if (this.canBackward()) {
      const command = this.commandsHistory[this.currentCommandPointer];
      if (command) {
        command.undo();
        this.currentCommandPointer--;
      }
    }
  }

  canForward(): boolean {
    return this.currentCommandPointer < this.commandsHistory.length - 1;
  }

  canBackward(): boolean {
    return this.currentCommandPointer >= 0;
  }

  reset(): void {
    this.commandsHistory = [];
    this.currentCommandPointer = -1;
  }

  /**
   * 현재 위치 이후의 모든 Command 제거
   * 새 액션 실행 시 redo 스택을 제거하기 위해 사용
   */
  private clearForwards(): void {
    this.commandsHistory = this.commandsHistory.slice(0, this.currentCommandPointer + 1);
  }

  private updateCommandPointer(): void {
    this.currentCommandPointer = this.commandsHistory.length - 1;
  }

  getState() {
    return {
      totalCommands: this.commandsHistory.length,
      currentPointer: this.currentCommandPointer,
      canUndo: this.canBackward(),
      canRedo: this.canForward(),
    };
  }
}
