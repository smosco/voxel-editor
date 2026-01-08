import { useThree } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import type { Voxel } from '@voxel-editor/shared-types';

export interface RaycastHit {
  type: 'voxel' | 'grid';
  point: THREE.Vector3; // 충돌 지점
  normal: THREE.Vector3; // 충돌 면의 법선 벡터
  voxel?: Voxel; // 충돌한 복셀 (type === 'voxel'일 때만)
  gridPosition?: { x: number; z: number }; // 그리드 좌표 (type === 'grid'일 때만)
}

/**
 * 마우스 포인터와 복셀/그리드 충돌을 감지하는 레이캐스터 훅
 */
export function useVoxelRaycaster(voxels: Voxel[]) {
  const { camera, size } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const raycast = useCallback(
    (clientX: number, clientY: number): RaycastHit | null => {
      // NDC 좌표로 변환 (-1 ~ 1)
      const mouse = new THREE.Vector2(
        (clientX / size.width) * 2 - 1,
        -(clientY / size.height) * 2 + 1
      );

      raycaster.current.setFromCamera(mouse, camera);

      // 1. 복셀과의 충돌 검사 (우선순위 높음)
      const voxelHit = checkVoxelIntersection(raycaster.current, voxels);
      if (voxelHit) return voxelHit;

      // 2. 그리드 평면과의 충돌 검사
      const gridHit = checkGridIntersection(raycaster.current);
      return gridHit;
    },
    [camera, size, voxels]
  );

  return { raycast };
}

/**
 * 복셀과의 충돌 검사
 */
function checkVoxelIntersection(
  raycaster: THREE.Raycaster,
  voxels: Voxel[]
): RaycastHit | null {
  let closestHit: RaycastHit | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const voxel of voxels) {
    const box = new THREE.Box3(
      new THREE.Vector3(voxel.x - 0.5, voxel.y - 0.5, voxel.z - 0.5),
      new THREE.Vector3(voxel.x + 0.5, voxel.y + 0.5, voxel.z + 0.5)
    );

    const intersection = new THREE.Vector3();
    const intersects = raycaster.ray.intersectBox(box, intersection);

    if (intersects) {
      const distance = raycaster.ray.origin.distanceTo(intersection);
      if (distance < closestDistance) {
        closestDistance = distance;

        // 충돌 면의 법선 벡터 계산
        const normal = calculateBoxNormal(intersection, voxel);

        closestHit = {
          type: 'voxel',
          point: intersection,
          normal,
          voxel,
        };
      }
    }
  }

  return closestHit;
}

/**
 * 그리드 평면(XZ, Y=0)과의 충돌 검사
 */
function checkGridIntersection(raycaster: THREE.Raycaster): RaycastHit | null {
  const gridPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Y=0 평면
  const intersection = new THREE.Vector3();

  const intersects = raycaster.ray.intersectPlane(gridPlane, intersection);

  if (!intersects) return null;

  // 그리드 좌표로 스냅
  const gridX = Math.round(intersection.x);
  const gridZ = Math.round(intersection.z);

  return {
    type: 'grid',
    point: new THREE.Vector3(gridX, 0, gridZ),
    normal: new THREE.Vector3(0, 1, 0), // 항상 위쪽
    gridPosition: { x: gridX, z: gridZ },
  };
}

/**
 * 박스 표면의 법선 벡터 계산
 */
function calculateBoxNormal(point: THREE.Vector3, voxel: Voxel): THREE.Vector3 {
  const localPoint = new THREE.Vector3(
    point.x - voxel.x,
    point.y - voxel.y,
    point.z - voxel.z
  );

  // 각 축에서 가장 가까운 면을 찾음
  const absX = Math.abs(localPoint.x);
  const absY = Math.abs(localPoint.y);
  const absZ = Math.abs(localPoint.z);

  const maxAxis = Math.max(absX, absY, absZ);

  if (maxAxis === absX) {
    return new THREE.Vector3(Math.sign(localPoint.x), 0, 0);
  }
  if (maxAxis === absY) {
    return new THREE.Vector3(0, Math.sign(localPoint.y), 0);
  }
  return new THREE.Vector3(0, 0, Math.sign(localPoint.z));
}
