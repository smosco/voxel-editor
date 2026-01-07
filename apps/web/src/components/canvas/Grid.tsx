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
    for (let i = 0; i <= divisions; i++) {
      const offset = -halfSize + i * step;

      // X축 평행 선
      positions.push(-halfSize, 0, offset);
      positions.push(halfSize, 0, offset);

      // Z축 평행 선
      positions.push(offset, 0, -halfSize);
      positions.push(offset, 0, halfSize);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return <lineSegments geometry={gridGeometry} material={gridMaterial} />;
}
