/**
 * 카메라 초기 각도 설정 훅
 * Reference: Camera default angles
 */

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export function useInitialCamera() {
  const { camera } = useThree();

  useEffect(() => {
    // 기본 각도: 수평 -45°, 수직 25°
    // 대각선 위에서 내려다보는 뷰
    const distance = 25;

    // 간단한 계산: -45° 수평, 25° 수직
    const x = distance * 0.7; // cos(45°) ≈ 0.7
    const y = distance * 0.4; // sin(25°) ≈ 0.4
    const z = distance * 0.7; // cos(45°) ≈ 0.7

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
}
