/**
 * Core voxel data types
 * Reference: RenderingModel, Model3D, FigureBuilder
 */

/**
 * Voxel data structure: [x, y, z, side, color]
 * - x, y, z: position coordinates
 * - side: face index (0-5 for cube faces)
 * - color: color index or RGB value
 */
export type VoxelData = [number, number, number, number, number];

/**
 * RGB color representation
 */
export interface Color {
  r: number;
  g: number;
  b: number;
}

/**
 * Individual voxel with position and color
 */
export interface Voxel {
  x: number;
  y: number;
  z: number;
  color: Color;
}

/**
 * Voxel face/side enumeration
 * Reference: Face culling system from FigureBuilder
 */
export enum VoxelSide {
  FRONT = 0,
  BACK = 1,
  TOP = 2,
  BOTTOM = 3,
  LEFT = 4,
  RIGHT = 5,
}

/**
 * Grid parameters for voxel placement
 */
export interface GridParams {
  /** Grid size (e.g., 16x16x16) */
  size: number;
  /** Grid cell size for raycasting */
  cellSize: number;
  /** Show/hide grid */
  visible: boolean;
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

/**
 * Serialized voxel model data
 * Reference: RenderingModel serialization format
 */
export interface SerializedModel {
  /** Model name/title */
  name: string;
  /** Array of voxel data: [x, y, z, side, color][] */
  voxels: VoxelData[];
  /** Timestamp of creation/modification */
  timestamp: number;
  /** Model metadata */
  metadata?: {
    author?: string;
    description?: string;
    tags?: string[];
  };
}

/**
 * 3D Model representation in memory
 */
export interface Model3D {
  id: string;
  name: string;
  voxels: Voxel[];
  gridSize: number;
  createdAt: Date;
  updatedAt: Date;
}
