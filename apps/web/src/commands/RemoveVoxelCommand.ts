import type { Command, Voxel } from '@voxel-editor/shared-types';

/**
 * 복셀 삭제 Command
 * execute()에서 복셀을 삭제하고, undo()에서 다시 추가하여 복원
 *
 * Reference FigureChangesManager - newCommandDeleteCubeList()
 */
export class RemoveVoxelCommand implements Command {
  constructor(
    private readonly voxel: Voxel,
    private readonly onRemove: (voxel: Voxel) => void,
    private readonly onAdd: (voxel: Voxel) => void
  ) {}

  execute(_firstTime: boolean): void {
    this.onRemove(this.voxel);
  }

  undo(): void {
    this.onAdd(this.voxel);
  }
}
