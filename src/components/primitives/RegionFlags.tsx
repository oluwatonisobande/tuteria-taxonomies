import React from 'react';
import { RegionVariant } from '../../model/taxonomy';

interface RegionFlagsProps {
  variants: RegionVariant[];
}

const REGION_FLAG_MAP: Record<string, { flag: string; label: string }> = {
  NG: { flag: '🇳🇬', label: 'Nigeria' },
  GB: { flag: '🇬🇧', label: 'United Kingdom' },
  UK: { flag: '🇬🇧', label: 'United Kingdom' },
  US: { flag: '🇺🇸', label: 'United States' },
  GH: { flag: '🇬🇭', label: 'Ghana' },
  CA: { flag: '🇨🇦', label: 'Canada' },
  ZA: { flag: '🇿🇦', label: 'South Africa' },
  KE: { flag: '🇰🇪', label: 'Kenya' },
};

export const RegionFlags: React.FC<RegionFlagsProps> = ({ variants }) => {
  if (!variants || variants.length === 0) {
    return (
      <span className="text-xs text-[var(--text-muted)] italic" title="No regional variants defined">
        Universal
      </span>
    );
  }

  // Deduplicate regions by code
  const uniqueRegions: string[] = Array.from(
    new Set<string>(variants.map((v) => v.regionCode.toUpperCase()))
  );

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {uniqueRegions.map((code) => {
        const info = REGION_FLAG_MAP[code] || { flag: '🌐', label: code };
        return (
          <span
            key={code}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded border border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] font-mono select-none"
            title={`${info.label} (${code})`}
          >
            <span>{info.flag}</span>
            <span>{code}</span>
          </span>
        );
      })}
    </div>
  );
};
