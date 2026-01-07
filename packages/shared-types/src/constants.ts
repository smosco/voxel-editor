/**
 * 전역 상수 정의
 * Reference: Settings, Camera, ColorHelper
 */

// ============ 카메라 설정 ============
export const CAMERA = {
  DEFAULT_H_ANGLE: -45, // 기본 수평 회전각 (도)
  DEFAULT_V_ANGLE: 25, // 기본 수직 회전각 (도)
  ANIMATION_DURATION: 300, // 카메라 애니메이션 시간 (ms)
  NEAR: 3.0, // 근평면 거리
  FAR: 100.0, // 원평면 거리
  MIN_ZOOM: 0.27, // 최소 줌
  MAX_ZOOM: 5.7, // 최대 줌
} as const;

// ============ 그리드 설정 ============
export const GRID = {
  CELL_SIZE: 1.0, // 그리드 셀 크기
  LINE_WIDTH: 0.015, // 그리드 선 두께
  COLOR_DARK: '#999999', // 어두운 배경용 그리드 색상
  COLOR_LIGHT: '#adacac', // 밝은 배경용 그리드 색상
  HIGHLIGHT_COLOR: '#a142f4', // 선택 영역 하이라이트 색상 (보라)
  FADE_DISTANCE: 4, // 가장자리 페이드 시작 거리 (셀 단위)
  MAX_SIZE: 24, // 최대 그리드 크기
  MIN_SIZE: 16, // 최소 그리드 크기
  UNLIMITED_SIZE: 1000, // 무제한 모드 그리드 크기
} as const;

// ============ 복셀 설정 ============
export const VOXEL = {
  SIZE: 1.0, // 복셀 기본 크기
  SCALE: 0.95, // 복셀 실제 렌더링 스케일 (5% 간격)
  HIT_SPHERE_RADIUS: Math.sqrt(2) * 0.5, // 레이캐스팅용 충돌 구 반지름 (≈ 0.707)
  Y_OFFSET: 0.5, // Y축 오프셋 (그리드 y=0, 첫 복셀 y=0.5)
} as const;

// ============ 조명 설정 ============
export const LIGHTING = {
  DISTANCE: 1000, // 조명 거리
  POSITIONS: [
    [0, 0, 1000], // 앞
    [0, 0, -1000], // 뒤
    [0, 1000, 0], // 위
    [0, -1000, 0], // 아래
    [1000, 0, 0], // 오른쪽
    [-1000, 0, 0], // 왼쪽
  ] as const,
} as const;

// ============ 색상 팔레트 ============
export const COLORS = {
  DEFAULT_VOXEL: 254, // 기본 복셀 색상 코드 (#DADADA)
  DEFAULT_SELECTED: 243, // 기본 선택 색상 코드 (#00DFD3 Cyan)

  // 16색 팔레트 (4x4 그리드 순서)
  PALETTE: [
    // Row 1
    { code: 243, hex: '#00DFD3', name: 'Cyan' },
    { code: 241, hex: '#005FDF', name: 'Blue' },
    { code: 244, hex: '#32AE54', name: 'Green' },
    { code: 242, hex: '#14DFFF', name: 'Light Blue' },

    // Row 2
    { code: 245, hex: '#ACDB00', name: 'Light Green' },
    { code: 253, hex: '#8D5735', name: 'Brown' },
    { code: 246, hex: '#FBDA03', name: 'Yellow' },
    { code: 252, hex: '#DD9863', name: 'Tan' },

    // Row 3
    { code: 247, hex: '#FEB329', name: 'Orange' },
    { code: 251, hex: '#EFC5A0', name: 'Beige' },
    { code: 248, hex: '#E91724', name: 'Red' },
    { code: 254, hex: '#DADADA', name: 'Light Gray' },

    // Row 4
    { code: 250, hex: '#FF7BAE', name: 'Pink' },
    { code: 255, hex: '#B2B3B4', name: 'Gray' },
    { code: 249, hex: '#8E56AA', name: 'Purple' },
    { code: 224, hex: '#4B4B4B', name: 'Dark Gray' },
  ] as const,
} as const;

// ============ 애니메이션 설정 ============
export const ANIMATION = {
  DURATION: 350, // 일반 애니메이션 시간 (ms)
  ROTATION_DURATION: 300, // 카메라 회전 애니메이션 (ms)
  DRAW_DELAY: 350, // 그리기 지연 시간 (ms)
} as const;

// ============ 제약 조건 ============
export const CONSTRAINTS = {
  MAX_MODEL_SIZE: 24, // 최대 모델 크기 (각 축당 복셀 수)
  SIZE_LIMIT_ADAPTIVE: 8, // 자동 줌 조정 트리거 크기
  BACKGROUND_DARK_THRESHOLD: 0.3, // 어두운 배경 판단 임계값 (그레이스케일)
  BACKGROUND_LIGHT_THRESHOLD: 0.8, // 밝은 배경 판단 임계값
} as const;

// ============ 유틸리티 함수 ============

/** 색상 코드로 hex 값 찾기 */
export function getColorHexByCode(code: number): string | undefined {
  return COLORS.PALETTE.find((c) => c.code === code)?.hex;
}

/** hex 값으로 색상 코드 찾기 */
export function getColorCodeByHex(hex: string): number | undefined {
  return COLORS.PALETTE.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.code;
}

/** 기본 복셀 색상 hex 반환 */
export function getDefaultVoxelColor(): string {
  return getColorHexByCode(COLORS.DEFAULT_VOXEL) || '#DADADA';
}

/** 기본 선택 색상 hex 반환 */
export function getDefaultSelectedColor(): string {
  return getColorHexByCode(COLORS.DEFAULT_SELECTED) || '#00DFD3';
}
