/**
 * @voxel-editor/voxel-core
 * Core voxel manipulation and serialization logic
 */

// Face culling
export {
  buildVoxelMap,
  countVisibleFaces,
  getVisibleFaces,
  getVoxelKey,
} from './face-culling';

// Grid utilities
export {
  calculateVoxelPosition,
  generateGridLines,
  getNeighbors,
  isInBounds,
  snapToGrid,
} from './grid';
// Serialization
export {
  deserializeModel,
  deserializeVoxels,
  intToRgb,
  rgbToInt,
  serializeModel,
  serializeVoxels,
} from './serialization';
