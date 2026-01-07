/**
 * 복셀 메쉬 컴포넌트
 * Reference: FigureBuilder geometry generation
 */

import type { Voxel } from '@voxel-editor/shared-types';
import { VOXEL, VoxelSide } from '@voxel-editor/shared-types';
import { buildVoxelMap, getVisibleFaces } from '@voxel-editor/voxel-core';
import { useMemo } from 'react';
import * as THREE from 'three';

interface VoxelMeshProps {
  voxels: Voxel[];
}

export function VoxelMesh({ voxels }: VoxelMeshProps) {
  const geometry = useMemo(() => {
    return createVoxelGeometry(voxels);
  }, [voxels]);

  return (
    <mesh geometry={geometry}>
      <meshLambertMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * 복셀 배열로부터 단일 병합된 geometry 생성
 * Face culling 적용하여 보이는 면만 렌더링
 */
function createVoxelGeometry(voxels: Voxel[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];

  const voxelMap = buildVoxelMap(voxels);

  for (const voxel of voxels) {
    const visibleFaces = getVisibleFaces(voxel, voxelMap);

    for (const face of visibleFaces) {
      addFaceGeometry(positions, normals, colors, voxel, face);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  return geometry;
}

/**
 * 큐브의 한 면을 geometry 버퍼에 추가
 */
function addFaceGeometry(
  positions: number[],
  normals: number[],
  colors: number[],
  voxel: Voxel,
  face: VoxelSide
) {
  const { x, y, z, color } = voxel;
  const size = VOXEL.SIZE / 2; // 0.5 (틈 없이 딱 붙음)

  // 각 면의 4개 꼭짓점과 법선 벡터
  const faceData = getFaceVertices(x, y, z, size, face);

  // 2개의 삼각형으로 사각형 면 구성 (6개 정점)
  const indices = [0, 1, 2, 0, 2, 3] as const;

  for (const idx of indices) {
    const vertex = faceData.vertices[idx];
    if (!vertex) continue; // 타입 가드
    positions.push(vertex[0], vertex[1], vertex[2]);
    normals.push(faceData.normal[0], faceData.normal[1], faceData.normal[2]);
    colors.push(color.r, color.g, color.b);
  }
}

/**
 * 면의 꼭짓점과 법선 벡터 반환
 */
function getFaceVertices(
  x: number,
  y: number,
  z: number,
  size: number,
  face: VoxelSide
): {
  vertices: [number, number, number][];
  normal: [number, number, number];
} {
  switch (face) {
    case VoxelSide.FRONT: // Z+
      return {
        vertices: [
          [x - size, y - size, z + size],
          [x + size, y - size, z + size],
          [x + size, y + size, z + size],
          [x - size, y + size, z + size],
        ],
        normal: [0, 0, 1],
      };

    case VoxelSide.BACK: // Z-
      return {
        vertices: [
          [x + size, y - size, z - size],
          [x - size, y - size, z - size],
          [x - size, y + size, z - size],
          [x + size, y + size, z - size],
        ],
        normal: [0, 0, -1],
      };

    case VoxelSide.TOP: // Y+
      return {
        vertices: [
          [x - size, y + size, z - size],
          [x - size, y + size, z + size],
          [x + size, y + size, z + size],
          [x + size, y + size, z - size],
        ],
        normal: [0, 1, 0],
      };

    case VoxelSide.BOTTOM: // Y-
      return {
        vertices: [
          [x - size, y - size, z + size],
          [x - size, y - size, z - size],
          [x + size, y - size, z - size],
          [x + size, y - size, z + size],
        ],
        normal: [0, -1, 0],
      };

    case VoxelSide.RIGHT: // X+
      return {
        vertices: [
          [x + size, y - size, z + size],
          [x + size, y - size, z - size],
          [x + size, y + size, z - size],
          [x + size, y + size, z + size],
        ],
        normal: [1, 0, 0],
      };

    case VoxelSide.LEFT: // X-
      return {
        vertices: [
          [x - size, y - size, z - size],
          [x - size, y - size, z + size],
          [x - size, y + size, z + size],
          [x - size, y + size, z - size],
        ],
        normal: [-1, 0, 0],
      };

    default:
      throw new Error(`Unknown face: ${face}`);
  }
}
