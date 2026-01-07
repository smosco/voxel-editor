/**
 * Database schema types for Supabase
 */

import type { SerializedModel } from './voxel';

/**
 * Database table: models
 */
export interface DbModel {
  id: string;
  user_id: string;
  name: string;
  /** JSON-serialized voxel data */
  data: SerializedModel;
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Database table: users
 */
export interface DbUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

/**
 * Database table: shared_models (for collaboration)
 */
export interface DbSharedModel {
  id: string;
  model_id: string;
  shared_by: string;
  shared_with: string;
  permission: 'view' | 'edit';
  created_at: string;
}

/**
 * API request/response types
 */
export interface CreateModelRequest {
  name: string;
  data: SerializedModel;
  isPublic?: boolean;
}

export interface UpdateModelRequest {
  name?: string;
  data?: SerializedModel;
  isPublic?: boolean;
}

export interface ModelResponse {
  success: boolean;
  model?: DbModel;
  error?: string;
}

export interface ModelsListResponse {
  success: boolean;
  models?: DbModel[];
  error?: string;
}
