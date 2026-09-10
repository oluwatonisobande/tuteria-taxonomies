import React from 'react';
import { Taxonomy } from '../../model/taxonomy';
import { TypePill } from '../primitives/TypePill';
import { CategoryList } from '../primitives/CategoryPill';
import { RegionFlags } from '../primitives/RegionFlags';
import { ItemCount } from '../primitives/ItemCount';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { PermissionCapabilities } from '../../model/permissions';

export interface TaxonomyRowProps {
  taxonomy: Taxonomy;
  capabilities: PermissionCapabilities;
  onSelect: (taxonomy: Taxonomy) => void;
  onEdit?: (taxonomy: Taxonomy) => void;
  onDelete?: (taxonomy: Taxonomy) => void;
}

export const TaxonomyRow: React.FC<TaxonomyRowProps> = ({
  taxonomy,
  capabilities,
  onSelect,
  onEdit,
  onDelete,
}) => {
  // Extract distinct categories from items
  const categories = Array.from(
    new Set(
      taxonomy.items
        .map((item) => item.categoryLabel)
        .filter((label): label is string => Boolean(label))
    )
  );

  // Flatten region variants from all items in this taxonomy
  const allVariants = taxonomy.items.flatMap((i) => i.regionVariants);

  return (
    <tr
      className="group hover:bg-[var(--surface-hover)] transition-colors duration-150 border-b border-[var(--border-subtle)] text-sm"
      id={`taxonomy-row-${taxonomy.id}`}
    >
      {/* Name & Description */}
      <td className="py-4 px-5 align-top max-w-xs">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onSelect(taxonomy)}
            className="text-left font-medium text-[var(--text-primary)] hover:text-[var(--palette-blue-700)] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--palette-blue-700)] rounded-xs"
          >
            {taxonomy.name}
          </button>
          {taxonomy.description && (
            <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
              {taxonomy.description}
            </p>
          )}
          {taxonomy.programRefs && taxonomy.programRefs.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">
                Programs:
              </span>
              {taxonomy.programRefs.slice(0, 2).map((ref) => (
                <span
                  key={ref}
                  className="text-[11px] text-[var(--text-tertiary)] bg-[var(--surface-sunken)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"
                >
                  {ref}
                </span>
              ))}
              {taxonomy.programRefs.length > 2 && (
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  +{taxonomy.programRefs.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="py-4 px-4 align-top whitespace-nowrap">
        <TypePill type={taxonomy.type} />
      </td>

      {/* Item Count */}
      <td className="py-4 px-4 align-top whitespace-nowrap">
        <ItemCount count={taxonomy.items.length} />
      </td>

      {/* Categories */}
      <td className="py-4 px-4 align-top">
        <CategoryList categories={categories} maxDisplay={2} />
      </td>

      {/* Region Variants */}
      <td className="py-4 px-4 align-top">
        <RegionFlags variants={allVariants} />
      </td>

      {/* Actions */}
      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onSelect(taxonomy)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--palette-blue-700)] hover:bg-[var(--palette-blue-50)] rounded-md transition-colors cursor-pointer"
            title="View Details"
            aria-label={`View ${taxonomy.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {capabilities.canEdit && (
            <button
              type="button"
              onClick={() => (onEdit ? onEdit(taxonomy) : onSelect(taxonomy))}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--palette-blue-700)] hover:bg-[var(--palette-blue-50)] rounded-md transition-colors cursor-pointer"
              title="Edit Taxonomy"
              aria-label={`Edit ${taxonomy.name}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {capabilities.canEdit && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(taxonomy)}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--palette-rose-600)] hover:bg-[var(--palette-rose-50)] rounded-md transition-colors cursor-pointer"
              title="Delete Taxonomy"
              aria-label={`Delete ${taxonomy.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
