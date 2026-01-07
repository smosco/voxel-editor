/**
 * 그리드 헬퍼 (페이드 효과 포함)
 * Reference: Settings grid parameters
 */

import { GRID } from '@voxel-editor/shared-types';
import { useMemo } from 'react';
import * as THREE from 'three';

export function Grid() {
  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color('#999999'), // 어두운 회색
      transparent: true,
      opacity: 0.4,
    });
  }, []);

  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const size = GRID.MAX_SIZE;
    const divisions = size;
    const step = size / divisions;
    const halfSize = size / 2;

    // XZ 평면 그리드 (Y=0)
    // 0.5씩 오프셋해서 그리드 칸 중심이 정수 좌표가 되도록 함
    for (let i = 0; i <= divisions; i++) {
      const offset = -halfSize + i * step + 0.5;

      // X축 평행 선
      positions.push(-halfSize + 0.5, 0, offset);
      positions.push(halfSize + 0.5, 0, offset);

      // Z축 평행 선
      positions.push(offset, 0, -halfSize + 0.5);
      positions.push(offset, 0, halfSize + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return <lineSegments geometry={gridGeometry} material={gridMaterial} />;
}
