/**
 * @voxel-editor/shared-types
 * Shared TypeScript types for the voxel editor
 */

// Command Pattern types
export type { Command } from './command';
export { CommandType, UndoRedoState } from './command';
// Constants
export {
  ANIMATION,
  CAMERA,
  COLORS,
  CONSTRAINTS,
  GRID,
  getColorCodeByHex,
  getColorHexByCode,
  getDefaultSelectedColor,
  getDefaultVoxelColor,
  LIGHTING,
  VOXEL,
} from './constants';
// Database types
export type {
  CreateModelRequest,
  DbModel,
  DbSharedModel,
  DbUser,
  ModelResponse,
  ModelsListResponse,
  UpdateModelRequest,
} from './database';
// Editor types
export type { EditorAction, EditorState, RaycastResult } from './editor';
export { EditorTool } from './editor';
// Voxel types
export type {
  CameraConfig,
  Color,
  GridParams,
  Model3D,
  SerializedModel,
  Voxel,
  VoxelData,
} from './voxel';
export { VoxelSide } from './voxel';
