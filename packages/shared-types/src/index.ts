/**
 * @voxel-editor/shared-types
 * Shared TypeScript types for the voxel editor
 */

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
