/**
 * Editor-specific types for UI state and tools
 */

import type { Color, Voxel } from './voxel';

/**
 * Editor tool modes
 */
export enum EditorTool {
  /** Add voxels */
  ADD = 'add',
  /** Remove voxels */
  REMOVE = 'remove',
  /** Paint existing voxels */
  PAINT = 'paint',
  /** Select voxels */
  SELECT = 'select',
  /** Move camera */
  PAN = 'pan',
}

/**
 * Editor state
 */
export interface EditorState {
  /** Current active tool */
  currentTool: EditorTool;
  /** Selected color for adding/painting */
  selectedColor: Color;
  /** Grid visibility */
  showGrid: boolean;
  /** Selected voxels (for select tool) */
  selectedVoxels: Voxel[];
  /** History for undo/redo */
  history: {
    past: Voxel[][];
    present: Voxel[];
    future: Voxel[][];
  };
}

/**
 * Raycasting intersection result
 * Used for voxel placement detection
 */
export interface RaycastResult {
  /** Hit position in world space */
  point: [number, number, number];
  /** Hit normal vector */
  normal: [number, number, number];
  /** Grid-snapped position */
  gridPosition: [number, number, number];
  /** Face index that was hit */
  faceIndex: number;
}

/**
 * User action for history tracking
 */
export interface EditorAction {
  type: 'add' | 'remove' | 'paint' | 'batch';
  voxels: Voxel[];
  timestamp: number;
}
