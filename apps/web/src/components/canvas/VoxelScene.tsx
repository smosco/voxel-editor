/**
 * 3D 복셀 에디터 메인 씬
 * Reference: CubeRenderer from Android APK
 */

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { CAMERA, type Voxel } from '@voxel-editor/shared-types';
import { useInitialCamera } from '@/hooks/useInitialCamera';
import { Grid } from './Grid';
import { VoxelMesh } from './VoxelMesh';

// 테스트용 복셀 데이터
const testVoxels: Voxel[] = [
  { x: 0, y: 0.5, z: 0, color: { r: 0.86, g: 0.86, b: 0.86 } }, // 중앙
  { x: 1, y: 0.5, z: 0, color: { r: 1, g: 0, b: 0 } }, // 빨강 오른쪽
  { x: -1, y: 0.5, z: 0, color: { r: 0, g: 1, b: 0 } }, // 초록 왼쪽
  { x: 0, y: 0.5, z: 1, color: { r: 0, g: 0, b: 1 } }, // 파랑 앞
  { x: 0, y: 1.5, z: 0, color: { r: 1, g: 1, b: 0 } }, // 노랑 위
];

export function VoxelScene() {
  return (
    <Canvas
      camera={{
        position: [10, 10, 10],
        near: CAMERA.NEAR,
        far: CAMERA.FAR,
        zoom: 50, // 크게 확대
      }}
      orthographic
      gl={{
        antialias: true,
        alpha: false,
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
      }}
    >
      {/* 씬 배경색 */}
      <color attach="background" args={['#ffffff']} />

      {/* 카메라 초기 각도 설정 */}
      <CameraSetup />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />

      {/* 6방향 조명 */}
      <SceneLights />

      {/* 그리드 */}
      <Grid />

      {/* 복셀 메쉬 (face culling 적용) */}
      <VoxelMesh voxels={testVoxels} />
    </Canvas>
  );
}

/**
 * 카메라 초기 설정 컴포넌트
 */
function CameraSetup() {
  useInitialCamera();
  return null;
}

/**
 * 6방향 directional lights
 * Reference: CubeRenderer light configuration
 */
function SceneLights() {
  return (
    <>
      <directionalLight position={[0, 0, 1000]} intensity={1} />
      <directionalLight position={[0, 0, -1000]} intensity={1} />
      <directionalLight position={[0, 1000, 0]} intensity={1} />
      <directionalLight position={[0, -1000, 0]} intensity={1} />
      <directionalLight position={[1000, 0, 0]} intensity={1} />
      <directionalLight position={[-1000, 0, 0]} intensity={1} />
    </>
  );
}
