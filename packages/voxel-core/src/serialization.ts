/**
 * Voxel serialization/deserialization utilities
 * Reference: RenderingModelUtils
 */

import type { Color, SerializedModel, Voxel, VoxelData } from '@voxel-editor/shared-types';

/**
 * Serialize voxels to standard format
 * Converts Voxel[] to VoxelData[] with coordinate inversion
 */
export function serializeVoxels(voxels: Voxel[]): VoxelData[] {
  return voxels.map((voxel) => {
    // Reference: Inverts X and Z axes on save, Y has 0.5 offset for cube centering
    const x = -voxel.x;
    const y = voxel.y - 0.5;
    const z = -voxel.z;

    // Convert RGB to single color value (packed int or index)
    const color = rgbToInt(voxel.color);

    // Side is 0 for now (face culling handled separately)
    const side = 0;

    return [x, y, z, side, color];
  });
}

/**
 * Deserialize VoxelData[] to Voxel[]
 * Converts from serialized format to editor format
 */
export function deserializeVoxels(data: VoxelData[]): Voxel[] {
  return data.map(([x, y, z, _side, color]) => {
    // Reverse the coordinate inversion
    const voxel: Voxel = {
      x: -x,
      y: y + 0.5,
      z: -z,
      color: intToRgb(color),
    };
    return voxel;
  });
}

/**
 * Convert RGB color to packed integer
 * Format: 0xRRGGBB
 */
export function rgbToInt(color: Color): number {
  const r = Math.floor(color.r * 255);
  const g = Math.floor(color.g * 255);
  const b = Math.floor(color.b * 255);
  return (r << 16) | (g << 8) | b;
}

/**
 * Convert packed integer to RGB color
 */
export function intToRgb(color: number): Color {
  const r = ((color >> 16) & 0xff) / 255;
  const g = ((color >> 8) & 0xff) / 255;
  const b = (color & 0xff) / 255;
  return { r, g, b };
}

/**
 * Serialize entire model to JSON
 */
export function serializeModel(
  name: string,
  voxels: Voxel[],
  metadata?: SerializedModel['metadata']
): SerializedModel {
  return {
    name,
    voxels: serializeVoxels(voxels),
    timestamp: Date.now(),
    metadata,
  };
}

/**
 * Deserialize JSON model
 */
export function deserializeModel(data: SerializedModel): Voxel[] {
  return deserializeVoxels(data.voxels);
}
