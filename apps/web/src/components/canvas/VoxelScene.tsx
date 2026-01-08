/**
 * 3D 복셀 에디터 메인 씬
 * Reference: CubeRenderer from Android APK
 */

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { CAMERA, COLORS, type Voxel } from '@voxel-editor/shared-types';
import { useCallback, useEffect, useState } from 'react';
import { useInitialCamera } from '@/hooks/useInitialCamera';
import { type RaycastHit, useVoxelRaycaster } from '@/hooks/useVoxelRaycaster';
import { Grid } from './Grid';
import { VoxelMesh } from './VoxelMesh';
import { VoxelPreview } from './VoxelPreview';

/**
 * 컬러 팔레트 인덱스를 RGB 값으로 변환
 */
function getColorFromPalette(colorIndex: number): { r: number; g: number; b: number } {
  const paletteItem = COLORS.PALETTE[colorIndex];
  if (!paletteItem) {
    // 기본값 (회색)
    return { r: 0.86, g: 0.86, b: 0.86 };
  }

  // hex를 RGB로 변환
  const hex = paletteItem.hex.replace('#', '');
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

  return { r, g, b };
}

interface VoxelSceneProps {
  voxels: Voxel[];
  editorMode: 'add' | 'remove' | 'paint';
  selectedColor: number;
  onVoxelsChange: (voxels: Voxel[]) => void;
}

export function VoxelScene({ voxels, editorMode, selectedColor, onVoxelsChange }: VoxelSceneProps) {
  const [currentHit, setCurrentHit] = useState<RaycastHit | null>(null);

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

      {/* 씬 컨텐츠 (레이캐스팅 포함) */}
      <SceneContent
        voxels={voxels}
        editorMode={editorMode}
        selectedColor={selectedColor}
        onHitChange={setCurrentHit}
        onVoxelsChange={onVoxelsChange}
      />

      {/* 복셀 프리뷰 */}
      <VoxelPreview hit={currentHit} mode={editorMode} currentColor={selectedColor} />
    </Canvas>
  );
}

/**
 * 씬 컨텐츠 (레이캐스팅 처리)
 */
interface SceneContentProps {
  voxels: Voxel[];
  editorMode: 'add' | 'remove' | 'paint';
  selectedColor: number;
  onHitChange: (hit: RaycastHit | null) => void;
  onVoxelsChange: (voxels: Voxel[]) => void;
}

function SceneContent({
  voxels,
  editorMode,
  selectedColor,
  onHitChange,
  onVoxelsChange,
}: SceneContentProps) {
  const { raycast } = useVoxelRaycaster(voxels);

  // 복셀 추가 핸들러
  const handleAddVoxel = useCallback(
    (hit: RaycastHit) => {
      let newVoxel: Voxel;

      if (hit.type === 'voxel' && hit.voxel) {
        // 기존 복셀 위에 추가
        newVoxel = {
          x: hit.voxel.x + hit.normal.x,
          y: hit.voxel.y + hit.normal.y,
          z: hit.voxel.z + hit.normal.z,
          color: getColorFromPalette(selectedColor),
        };
      } else if (hit.type === 'grid' && hit.gridPosition) {
        // 그리드 위에 추가
        newVoxel = {
          x: hit.gridPosition.x,
          y: 0.5,
          z: hit.gridPosition.z,
          color: getColorFromPalette(selectedColor),
        };
      } else {
        return;
      }

      // 이미 같은 위치에 복셀이 있는지 확인
      const exists = voxels.some(
        (v) => v.x === newVoxel.x && v.y === newVoxel.y && v.z === newVoxel.z
      );
      if (!exists) {
        onVoxelsChange([...voxels, newVoxel]);
      }
    },
    [voxels, selectedColor, onVoxelsChange]
  );

  // 복셀 삭제 핸들러
  const handleRemoveVoxel = useCallback(
    (hit: RaycastHit) => {
      if (hit.type === 'voxel' && hit.voxel) {
        const newVoxels = voxels.filter(
          (v) => !(v.x === hit.voxel?.x && v.y === hit.voxel?.y && v.z === hit.voxel?.z)
        );
        onVoxelsChange(newVoxels);
      }
    },
    [voxels, onVoxelsChange]
  );

  // 복셀 색칠 핸들러
  const handlePaintVoxel = useCallback(
    (hit: RaycastHit) => {
      if (hit.type === 'voxel' && hit.voxel) {
        const newVoxels = voxels.map((v) =>
          v.x === hit.voxel?.x && v.y === hit.voxel?.y && v.z === hit.voxel?.z
            ? { ...v, color: getColorFromPalette(selectedColor) }
            : v
        );
        onVoxelsChange(newVoxels);
      }
    },
    [voxels, selectedColor, onVoxelsChange]
  );

  // Canvas 전체에서 pointer move 이벤트 처리
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const hit = raycast(e.clientX, e.clientY);
      onHitChange(hit);
    },
    [raycast, onHitChange]
  );

  // 클릭 이벤트 처리 (복셀 추가/삭제/색칠)
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const hit = raycast(e.clientX, e.clientY);
      if (!hit) return;

      if (editorMode === 'add') {
        handleAddVoxel(hit);
      } else if (editorMode === 'remove') {
        handleRemoveVoxel(hit);
      } else if (editorMode === 'paint') {
        handlePaintVoxel(hit);
      }
    },
    [raycast, editorMode, handleAddVoxel, handleRemoveVoxel, handlePaintVoxel]
  );

  // 마운트 시 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [handlePointerMove, handleClick]);

  return (
    <>
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
      <VoxelMesh voxels={voxels} />
    </>
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
