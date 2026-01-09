import { useRef } from 'react';
import * as THREE from 'three';
import type { RaycastHit } from '../../hooks/useVoxelRaycaster';

interface VoxelPreviewProps {
  hit: RaycastHit | null;
  mode: 'add' | 'remove' | 'paint';
}

/**
 * 마우스 위치에 따라 복셀 추가/삭제 프리뷰를 표시
 */
export function VoxelPreview({ hit, mode }: VoxelPreviewProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  if (!hit) return null;

  // 복셀 추가 모드: 법선 방향으로 1칸 이동한 위치
  if (mode === 'add' && hit.type === 'voxel' && hit.voxel) {
    const previewPosition = new THREE.Vector3(
      hit.voxel.x + hit.normal.x,
      hit.voxel.y + hit.normal.y,
      hit.voxel.z + hit.normal.z
    );

    return (
      <mesh ref={meshRef} position={previewPosition}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
    );
  }

  // 복셀 추가 모드: 그리드 위 (y=0.5)
  if (mode === 'add' && hit.type === 'grid' && hit.gridPosition) {
    return (
      <mesh ref={meshRef} position={[hit.gridPosition.x, 0.5, hit.gridPosition.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
      </mesh>
    );
  }

  // 복셀 삭제 모드: 충돌한 복셀 하이라이트
  if (mode === 'remove' && hit.type === 'voxel' && hit.voxel) {
    return (
      <mesh ref={meshRef} position={[hit.voxel.x, hit.voxel.y, hit.voxel.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>
    );
  }

  // 색칠 모드: 충돌한 복셀 하이라이트
  if (mode === 'paint' && hit.type === 'voxel' && hit.voxel) {
    return (
      <mesh ref={meshRef} position={[hit.voxel.x, hit.voxel.y, hit.voxel.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
      </mesh>
    );
  }

  return null;
}
