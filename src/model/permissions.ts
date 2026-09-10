/**
 * Permission capabilities and role derivation
 * Specification: Section 10 of assessment
 */

export type PermissionRole = 'no_access' | 'view_only' | 'editor' | 'publisher';

export interface PermissionCapabilities {
  canView: boolean;
  canEdit: boolean;
  canReview: boolean;
  canPublish: boolean;
}

export interface UserContext {
  id: string;
  name: string;
  role: PermissionRole;
}

export function getCapabilities(role: PermissionRole): PermissionCapabilities {
  switch (role) {
    case 'publisher':
      return {
        canView: true,
        canEdit: true,
        canReview: true,
        canPublish: true,
      };
    case 'editor':
      return {
        canView: true,
        canEdit: true,
        canReview: false,
        canPublish: false,
      };
    case 'view_only':
      return {
        canView: true,
        canEdit: false,
        canReview: false,
        canPublish: false,
      };
    case 'no_access':
    default:
      return {
        canView: false,
        canEdit: false,
        canReview: false,
        canPublish: false,
      };
  }
}
