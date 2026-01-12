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
  // 색상별로 복셀 그룹화 (Export와 동일)
  const voxelsByColor = useMemo(() => {
    return groupVoxelsByColor(voxels);
  }, [voxels]);

  return (
    <group>
      {/* 색상별로 별도 mesh 생성 (Export GLB와 동일) */}
      {Array.from(voxelsByColor.entries()).map(([colorKey, colorVoxels]) => {
        const firstVoxel = colorVoxels[0];
        if (!firstVoxel) return null;

        const voxelGeometry = createVoxelGeometryForColor(voxels, colorVoxels);
        const { r, g, b } = firstVoxel.color;

        return (
          <mesh key={colorKey} geometry={voxelGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={new THREE.Color(r, g, b)}
              metalness={0}
              roughness={1}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* 각 복셀마다 개별 박스와 경계선 */}
      {voxels.map((voxel, index) => (
        <VoxelEdges key={index} voxel={voxel} />
      ))}
    </group>
  );
}

/**
 * 개별 복셀의 경계선 컴포넌트
 *
 * Z-Fighting 해결 방법:
 * 1. 테두리를 0.2% 크게 만들어 mesh 표면보다 앞에 배치
 * 2. renderOrder를 1로 설정하여 mesh(기본값 0) 이후에 렌더링
 *
 * Note: polygonOffset은 Lines에 효과 없음 (Mesh에만 작동)
 */
function VoxelEdges({ voxel }: { voxel: Voxel }) {
  const edgeSize = VOXEL.SIZE * 1.002;
  const boxGeometry = useMemo(
    () => new THREE.BoxGeometry(edgeSize, edgeSize, edgeSize),
    [edgeSize]
  );
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);

  return (
    <lineSegments position={[voxel.x, voxel.y, voxel.z]} geometry={edgesGeometry} renderOrder={1}>
      <lineBasicMaterial color={0x000000} />
    </lineSegments>
  );
}

/**
 * 색상별로 복셀 그룹화 (Export와 동일)
 */
function groupVoxelsByColor(voxels: Voxel[]): Map<string, Voxel[]> {
  const groups = new Map<string, Voxel[]>();

  for (const voxel of voxels) {
    const colorKey = `${voxel.color.r},${voxel.color.g},${voxel.color.b}`;
    const group = groups.get(colorKey);
    if (group) {
      group.push(voxel);
    } else {
      groups.set(colorKey, [voxel]);
    }
  }

  return groups;
}

/**
 * 특정 색상 복셀들의 geometry 생성 (Export와 동일)
 */
function createVoxelGeometryForColor(
  allVoxels: Voxel[],
  colorVoxels: Voxel[]
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];

  const voxelMap = buildVoxelMap(allVoxels);

  for (const voxel of colorVoxels) {
    const visibleFaces = getVisibleFaces(voxel, voxelMap);

    for (const face of visibleFaces) {
      addFaceGeometry(positions, normals, voxel, face);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

  return geometry;
}

/**
 * 큐브의 한 면을 geometry 버퍼에 추가 (색상 없이)
 */
function addFaceGeometry(positions: number[], normals: number[], voxel: Voxel, face: VoxelSide) {
  const { x, y, z } = voxel;
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
