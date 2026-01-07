/**
 * Face culling optimization
 * Reference: FigureBuilder face visibility logic
 */

import type { Voxel } from '@voxel-editor/shared-types';
import { VoxelSide } from '@voxel-editor/shared-types';

/**
 * Voxel position key for fast lookup
 */
export function getVoxelKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

/**
 * Build voxel map for O(1) neighbor lookups
 */
export function buildVoxelMap(voxels: Voxel[]): Map<string, Voxel> {
  const map = new Map<string, Voxel>();
  for (const voxel of voxels) {
    map.set(getVoxelKey(voxel.x, voxel.y, voxel.z), voxel);
  }
  return map;
}

/**
 * Check which faces of a voxel should be rendered
 * Returns array of visible face indices
 */
export function getVisibleFaces(voxel: Voxel, voxelMap: Map<string, Voxel>): VoxelSide[] {
  const { x, y, z } = voxel;
  const visibleFaces: VoxelSide[] = [];

  // Check each face direction
  const neighbors = [
    { side: VoxelSide.FRONT, key: getVoxelKey(x, y, z + 1) },
    { side: VoxelSide.BACK, key: getVoxelKey(x, y, z - 1) },
    { side: VoxelSide.TOP, key: getVoxelKey(x, y + 1, z) },
    { side: VoxelSide.BOTTOM, key: getVoxelKey(x, y - 1, z) },
    { side: VoxelSide.LEFT, key: getVoxelKey(x - 1, y, z) },
    { side: VoxelSide.RIGHT, key: getVoxelKey(x + 1, y, z) },
  ];

  // Face is visible if there's no neighbor blocking it
  for (const { side, key } of neighbors) {
    if (!voxelMap.has(key)) {
      visibleFaces.push(side);
    }
  }

  return visibleFaces;
}

/**
 * Calculate total visible faces in model
 * Used for performance optimization
 */
export function countVisibleFaces(voxels: Voxel[]): number {
  const voxelMap = buildVoxelMap(voxels);
  let count = 0;

  for (const voxel of voxels) {
    count += getVisibleFaces(voxel, voxelMap).length;
  }

  return count;
}
