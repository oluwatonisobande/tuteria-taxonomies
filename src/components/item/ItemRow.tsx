import React from 'react';
import { FlattenedItemView } from '../../model/taxonomy';
import { TypePill } from '../primitives/TypePill';
import { CategoryPill } from '../primitives/CategoryPill';
import { RegionFlags } from '../primitives/RegionFlags';
import { ExternalLink, Eye, Edit2 } from 'lucide-react';
import { PermissionCapabilities } from '../../model/permissions';

export interface ItemRowProps {
  item: FlattenedItemView;
  capabilities: PermissionCapabilities;
  onOpenParentTaxonomy: (taxonomyId: string) => void;
  onEditItem?: (item: FlattenedItemView) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  capabilities,
  onOpenParentTaxonomy,
  onEditItem,
}) => {
  return (
    <tr
      className="group hover:bg-[var(--surface-hover)] transition-colors duration-150 border-b border-[var(--border-subtle)] text-sm"
      id={`item-row-${item.id}`}
    >
      {/* Item Name */}
      <td className="py-3.5 px-5 align-middle font-medium text-[var(--text-primary)]">
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
          {item.sortOrder !== undefined && (
            <span className="text-[11px] font-mono text-[var(--text-tertiary)] bg-[var(--surface-sunken)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
              #{item.sortOrder}
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-4 align-middle">
        {item.categoryLabel ? (
          <CategoryPill label={item.categoryLabel} />
        ) : (
          <span className="text-xs text-[var(--text-muted)] italic">Uncategorized</span>
        )}
      </td>

      {/* Parent Taxonomy (Actionable Link) */}
      <td className="py-3.5 px-4 align-middle">
        <button
          type="button"
          onClick={() => onOpenParentTaxonomy(item.taxonomyId)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--palette-blue-700)] hover:text-[var(--palette-blue-800)] hover:underline cursor-pointer group/link"
          title={`Open ${item.taxonomyName} taxonomy drawer`}
        >
          <span>{item.taxonomyName}</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100" />
        </button>
      </td>

      {/* Type */}
      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
        <TypePill type={item.taxonomyType} size="sm" />
      </td>

      {/* Region Variants */}
      <td className="py-3.5 px-4 align-middle">
        <RegionFlags variants={item.regionVariants} />
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onOpenParentTaxonomy(item.taxonomyId)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--palette-blue-700)] hover:bg-[var(--palette-blue-50)] rounded-md transition-colors cursor-pointer"
            title="Inspect in Taxonomy Drawer"
            aria-label={`Inspect ${item.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          {capabilities.canEdit && onEditItem && (
            <button
              type="button"
              onClick={() => onEditItem(item)}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--palette-blue-700)] hover:bg-[var(--palette-blue-50)] rounded-md transition-colors cursor-pointer"
              title="Edit Item in Drawer"
              aria-label={`Edit ${item.name}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
