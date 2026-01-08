/**
 * Command Pattern for Undo/Redo
 * Reference: FigureChangesManager
 */

export interface Command {
  /**
   * 명령 실행
   * @param firstTime true면 최초 실행 (사용자 액션), false면 redo 실행
   */
  execute(firstTime: boolean): void;

  /**
   * 명령 되돌리기 (정확한 역연산)
   */
  undo(): void;
}

/**
 * Command 타입
 */
export enum CommandType {
  ADD_CUBE = 0,
  CANCEL_ADD_CUBE = 1,
  REMOVE_CUBE = 2,
  CANCEL_REMOVE_CUBE = 2,
  PAINT_CUBE = 3,
  CANCEL_PAINT_CUBE = 4,
  CHANGE_BACKGROUND = 5,
  CANCEL_CHANGE_BACKGROUND = 6,
}

/**
 * Undo/Redo 가능 상태
 */
export enum UndoRedoState {
  CAN_NOT_FORWARD_BACKWARD = 0, // Undo/Redo 둘 다 불가
  CAN_BACKWARD = 1, // Undo만 가능
  CAN_FORWARD = 2, // Redo만 가능
  CAN_FORWARD_BACKWARD = 3, // Undo/Redo 둘 다 가능
}
