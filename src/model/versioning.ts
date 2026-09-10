/**
 * Semantic Versioning Engine
 * Specification: Section 12 of assessment
 */

import { VersionImpact } from './changes';

export interface Semver {
  major: number;
  minor: number;
  patch: number;
}

export interface VersionHistoryEntry {
  id: string;
  version: string;
  publishedAt: string;
  publishedBy: string;
  summary: string;
  impact: VersionImpact;
  changesCount: number;
  changes: Array<{
    id: string;
    summary: string;
    authorName: string;
    versionImpact: VersionImpact;
  }>;
}

export function parseSemver(versionStr: string): Semver {
  const cleaned = versionStr.replace(/^v/, '').trim();
  const parts = cleaned.split('.').map((p) => parseInt(p, 10));
  return {
    major: Number.isNaN(parts[0]) ? 1 : parts[0],
    minor: Number.isNaN(parts[1]) ? 0 : parts[1],
    patch: Number.isNaN(parts[2]) ? 0 : parts[2],
  };
}

export function formatSemver(version: Semver, prefix = true): string {
  const str = `${version.major}.${version.minor}.${version.patch}`;
  return prefix ? `v${str}` : str;
}

/**
 * Pure function: Given a semver and a version impact, bump according to semver specification:
 * - major: major + 1, minor = 0, patch = 0
 * - minor: minor + 1, patch = 0
 * - patch: patch + 1
 */
export function bumpVersion(version: Semver, impact: VersionImpact): Semver {
  switch (impact) {
    case 'major':
      return {
        major: version.major + 1,
        minor: 0,
        patch: 0,
      };
    case 'minor':
      return {
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
      };
    case 'patch':
      return {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
      };
  }
}

/**
 * Returns the highest impact from a list of impacts
 * Priority: major > minor > patch
 */
export function getHighestImpact(impacts: VersionImpact[]): VersionImpact {
  if (impacts.includes('major')) return 'major';
  if (impacts.includes('minor')) return 'minor';
  return 'patch';
}
