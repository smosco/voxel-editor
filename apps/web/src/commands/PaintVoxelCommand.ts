import type { Command, Voxel } from '@voxel-editor/shared-types';

/**
 * 복셀 색칠 Command
 * oldColor와 newColor를 저장하여 execute()에서 새 색상 적용, undo()에서 원래 색상 복원
 *
 * Reference FigureChangesManager - newCommandPaintCubeList()
 */
export class PaintVoxelCommand implements Command {
  constructor(
    private readonly voxel: Voxel,
    private readonly oldColor: { r: number; g: number; b: number },
    private readonly newColor: { r: number; g: number; b: number },
    private readonly onPaint: (voxel: Voxel, color: { r: number; g: number; b: number }) => void
  ) {}

  execute(_firstTime: boolean): void {
    this.onPaint(this.voxel, this.newColor);
  }

  undo(): void {
    this.onPaint(this.voxel, this.oldColor);
  }
}
