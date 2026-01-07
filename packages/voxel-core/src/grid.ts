/**
 * Grid utilities for voxel placement
 * Reference: GridBuilder and ObjectSelectHelper
 */

/**
 * Snap world position to grid
 * Uses Math.round() to align to nearest grid point
 */
export function snapToGrid(
  position: [number, number, number],
  gridSize = 1
): [number, number, number] {
  return [
    Math.round(position[0] / gridSize) * gridSize,
    Math.round(position[1] / gridSize) * gridSize,
    Math.round(position[2] / gridSize) * gridSize,
  ];
}

/**
 * Calculate voxel position from raycast intersection
 * @param point - Intersection point in world space
 * @param normal - Surface normal at intersection
 * @param isAdding - True for add mode (offset by normal), false for remove mode
 */
export function calculateVoxelPosition(
  point: [number, number, number],
  normal: [number, number, number],
  isAdding: boolean
): [number, number, number] {
  // Offset by normal if adding, otherwise use intersection point
  const offset = isAdding ? 0.5 : -0.5;

  const offsetPoint: [number, number, number] = [
    point[0] + normal[0] * offset,
    point[1] + normal[1] * offset,
    point[2] + normal[2] * offset,
  ];

  return snapToGrid(offsetPoint);
}

/**
 * Check if position is within grid bounds
 */
export function isInBounds(position: [number, number, number], gridSize: number): boolean {
  const halfSize = gridSize / 2;
  return (
    Math.abs(position[0]) <= halfSize &&
    Math.abs(position[1]) <= halfSize &&
    Math.abs(position[2]) <= halfSize
  );
}

/**
 * Get neighboring voxel positions (6 faces)
 */
export function getNeighbors(position: [number, number, number]): [number, number, number][] {
  const [x, y, z] = position;
  return [
    [x + 1, y, z], // right
    [x - 1, y, z], // left
    [x, y + 1, z], // top
    [x, y - 1, z], // bottom
    [x, y, z + 1], // front
    [x, y, z - 1], // back
  ];
}

/**
 * Generate grid helper lines data
 * Returns line segments for rendering grid
 */
export function generateGridLines(
  size: number,
  divisions: number
): { start: [number, number, number]; end: [number, number, number] }[] {
  const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];
  const step = size / divisions;
  const halfSize = size / 2;

  // XZ plane grid (horizontal)
  for (let i = 0; i <= divisions; i++) {
    const offset = -halfSize + i * step;

    // Lines parallel to X axis
    lines.push({
      start: [-halfSize, 0, offset],
      end: [halfSize, 0, offset],
    });

    // Lines parallel to Z axis
    lines.push({
      start: [offset, 0, -halfSize],
      end: [offset, 0, halfSize],
    });
  }

  return lines;
}
