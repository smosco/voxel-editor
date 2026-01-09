/**
 * GLB (GLTF Binary) Export
 * Reference GltfModelCreator
 */

import type { Voxel } from '@voxel-editor/shared-types';
import { VoxelSide } from '@voxel-editor/shared-types';
import { buildVoxelMap, getVisibleFaces } from '@voxel-editor/voxel-core';
import * as THREE from 'three';

/**
 * 복셀 배열을 GLB 파일로 export
 * 같은 색상끼리 그룹화해서 각각 별도 MeshPrimitive 생성
 * Reference GltfModelCreator create()
 */
export async function exportVoxelsToGLB(voxels: Voxel[]): Promise<Blob> {
  const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');

  // 색상별로 복셀 그룹화
  const voxelsByColor = groupVoxelsByColor(voxels);

  const scene = new THREE.Scene();

  // 각 색상별로 별도 mesh 생성
  for (const [, colorVoxels] of voxelsByColor.entries()) {
    const firstVoxel = colorVoxels[0];
    if (!firstVoxel) continue;

    const geometry = createVoxelGeometry(voxels, colorVoxels);
    const color = firstVoxel.color;

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color.r, color.g, color.b),
        metalness: 0,
        roughness: 1,
      })
    );
    scene.add(mesh);
  }

  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([result as ArrayBuffer], {
          type: 'model/gltf-binary',
        });
        resolve(blob);
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

/**
 * 색상별로 복셀 그룹화
 * Reference GltfModelCreator getModelData()
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
 * 복셀 배열에서 Three.js Geometry 생성 (face culling 적용)
 * Reference GltfModelCreator getVertexBufferV2()
 */
function createVoxelGeometry(allVoxels: Voxel[], colorVoxels: Voxel[]): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Face culling을 위한 voxel map 생성 (전체 복셀 기준)
  const voxelMap = buildVoxelMap(allVoxels);

  for (const voxel of colorVoxels) {
    // 보이는 면만 찾기
    const visibleFaces = getVisibleFaces(voxel, voxelMap);

    for (const face of visibleFaces) {
      const baseIdx = positions.length / 3;
      addCubeFace(positions, normals, voxel.x, voxel.y, voxel.z, face);
      addFaceIndices(indices, baseIdx);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);

  return geometry;
}

/**
 * 단일 큐브 면 추가
 * Reference VoxelMesh.tsx - getFaceVertices()
 */
function addCubeFace(
  positions: number[],
  normals: number[],
  x: number,
  y: number,
  z: number,
  face: VoxelSide
) {
  const s = 0.5;

  switch (face) {
    case VoxelSide.FRONT: // Z+
      positions.push(
        x - s,
        y - s,
        z + s,
        x + s,
        y - s,
        z + s,
        x + s,
        y + s,
        z + s,
        x - s,
        y + s,
        z + s
      );
      normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
      break;

    case VoxelSide.BACK: // Z-
      positions.push(
        x + s,
        y - s,
        z - s,
        x - s,
        y - s,
        z - s,
        x - s,
        y + s,
        z - s,
        x + s,
        y + s,
        z - s
      );
      normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);
      break;

    case VoxelSide.TOP: // Y+
      positions.push(
        x - s,
        y + s,
        z - s,
        x - s,
        y + s,
        z + s,
        x + s,
        y + s,
        z + s,
        x + s,
        y + s,
        z - s
      );
      normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      break;

    case VoxelSide.BOTTOM: // Y-
      positions.push(
        x - s,
        y - s,
        z + s,
        x - s,
        y - s,
        z - s,
        x + s,
        y - s,
        z - s,
        x + s,
        y - s,
        z + s
      );
      normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
      break;

    case VoxelSide.RIGHT: // X+
      positions.push(
        x + s,
        y - s,
        z + s,
        x + s,
        y - s,
        z - s,
        x + s,
        y + s,
        z - s,
        x + s,
        y + s,
        z + s
      );
      normals.push(1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0);
      break;

    case VoxelSide.LEFT: // X-
      positions.push(
        x - s,
        y - s,
        z - s,
        x - s,
        y - s,
        z + s,
        x - s,
        y + s,
        z + s,
        x - s,
        y + s,
        z - s
      );
      normals.push(-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0);
      break;
  }
}

/**
 * 단일 면의 indices 추가 (4개 vertex → 2개 삼각형)
 */
function addFaceIndices(arr: number[], base: number) {
  // 첫 번째 삼각형: 0, 1, 2
  arr.push(base, base + 1, base + 2);
  // 두 번째 삼각형: 0, 2, 3
  arr.push(base, base + 2, base + 3);
}

/**
 * Blob 다운로드
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
