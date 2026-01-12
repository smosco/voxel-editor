/**
 * LocalStorage 임시저장 유틸리티
 */

import type { Voxel } from '@voxel-editor/shared-types';

const STORAGE_KEY = 'voxel-editor-draft';

/**
 * 복셀 배열을 LocalStorage에 저장
 */
export function saveVoxelsToLocalStorage(voxels: Voxel[]): void {
  try {
    const json = JSON.stringify(voxels);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * LocalStorage에서 복셀 배열 로드
 * 저장된 데이터가 없으면 빈 배열 반환
 */
export function loadVoxelsFromLocalStorage(): Voxel[] {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return [];
    }
    const voxels = JSON.parse(json) as Voxel[];
    return voxels;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
}

/**
 * LocalStorage에서 임시저장 데이터 삭제
 */
export function clearVoxelsFromLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
