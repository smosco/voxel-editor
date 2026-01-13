import type { Command, Voxel } from '@voxel-editor/shared-types';

/**
 * 모든 복셀 삭제 Command
 * execute()에서 모든 복셀을 제거하고, undo()에서 이전 상태로 복원
 */
export class ClearAllVoxelsCommand implements Command {
  constructor(
    private readonly previousVoxels: Voxel[],
    private readonly onClear: () => void,
    private readonly onRestore: (voxels: Voxel[]) => void
  ) {}

  execute(_firstTime: boolean): void {
    this.onClear();
  }

  undo(): void {
    this.onRestore(this.previousVoxels);
  }
}
