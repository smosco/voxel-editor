import type { Command, Voxel } from '@voxel-editor/shared-types';

/**
 * 복셀 추가 Command
 * execute()에서 복셀을 추가하고, undo()에서 제거하여 정확히 역연산 수행
 *
 * Reference FigureChangesManager - newCommandAddCube()
 */
export class AddVoxelCommand implements Command {
  constructor(
    private readonly voxel: Voxel,
    private readonly onAdd: (voxel: Voxel) => void,
    private readonly onRemove: (voxel: Voxel) => void
  ) {}

  execute(_firstTime: boolean): void {
    this.onAdd(this.voxel);
  }

  undo(): void {
    this.onRemove(this.voxel);
  }
}
