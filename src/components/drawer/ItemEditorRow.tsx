import React, { useState } from 'react';
import { TaxonomyItem, RegionVariant } from '../../model/taxonomy';
import { Trash2, Plus, Globe, ArrowUp, ArrowDown, Tag } from 'lucide-react';
import { Button } from '../primitives/Button';

interface ItemEditorRowProps {
  item: TaxonomyItem;
  index: number;
  totalItems: number;
  isEditable: boolean;
  onUpdate: (updated: TaxonomyItem) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const ItemEditorRow: React.FC<ItemEditorRowProps> = ({
  item,
  index,
  totalItems,
  isEditable,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const [showVariants, setShowVariants] = useState(false);
  const [newRegionCode, setNewRegionCode] = useState('GB');
  const [newRegionName, setNewRegionName] = useState('United Kingdom');
  const [newRegionValue, setNewRegionValue] = useState('');

  const handleNameChange = (name: string) => {
    onUpdate({ ...item, name });
  };

  const handleCategoryChange = (categoryLabel: string) => {
    onUpdate({ ...item, categoryLabel });
  };

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionValue.trim()) return;

    const newVariant: RegionVariant = {
      regionCode: newRegionCode.toUpperCase(),
      regionName: newRegionName,
      value: newRegionValue.trim(),
    };

    onUpdate({
      ...item,
      regionVariants: [...item.regionVariants, newVariant],
    });

    setNewRegionValue('');
  };

  const handleRemoveVariant = (variantIdx: number) => {
    const updated = item.regionVariants.filter((_, idx) => idx !== variantIdx);
    onUpdate({ ...item, regionVariants: updated });
  };

  return (
    <div className="p-3.5 bg-[var(--surface-raised)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-all space-y-3">
      {/* Primary Row Controls */}
      <div className="flex items-center gap-3">
        {/* Reorder indices */}
        {isEditable && (
          <div className="flex flex-col items-center justify-center gap-0.5 text-[var(--text-tertiary)]">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              className="p-0.5 hover:text-[var(--text-primary)] disabled:opacity-20 cursor-pointer"
              title="Move item up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[var(--text-muted)] leading-none">
              {index + 1}
            </span>
            <button
              type="button"
              disabled={index === totalItems - 1}
              onClick={onMoveDown}
              className="p-0.5 hover:text-[var(--text-primary)] disabled:opacity-20 cursor-pointer"
              title="Move item down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Item Name Input or Text */}
        <div className="flex-1 min-w-0">
          {isEditable ? (
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Item name (e.g. Primary 1, Year 9)..."
              className="w-full text-sm font-medium text-[var(--text-primary)] bg-transparent border-b border-transparent focus:border-[var(--border-focus)] focus:outline-none px-1 py-0.5"
            />
          ) : (
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {item.name}
            </span>
          )}
        </div>

        {/* Category Badge or Input */}
        <div className="w-40 shrink-0">
          {isEditable ? (
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={item.categoryLabel || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                placeholder="Category (optional)"
                className="w-full text-xs text-[var(--text-secondary)] bg-[var(--surface-sunken)] px-2 py-1 rounded border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          ) : (
            item.categoryLabel && (
              <span className="text-xs text-[var(--text-secondary)] bg-[var(--surface-sunken)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                {item.categoryLabel}
              </span>
            )
          )}
        </div>

        {/* Region Variants Toggle */}
        <button
          type="button"
          onClick={() => setShowVariants(!showVariants)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
            item.regionVariants.length > 0 || showVariants
              ? 'bg-[var(--palette-blue-50)] text-[var(--palette-blue-700)] border-[var(--palette-blue-200)]'
              : 'text-[var(--text-tertiary)] border-[var(--border-subtle)] hover:text-[var(--text-secondary)]'
          }`}
          title="Toggle region variants"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{item.regionVariants.length}</span>
        </button>

        {/* Remove item button */}
        {isEditable && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--palette-rose-600)] transition-colors cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded Region Variants Editor */}
      {showVariants && (
        <div className="pl-6 pt-2 border-t border-[var(--border-subtle)] space-y-2">
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center justify-between">
            <span>Regional Localization Variants</span>
          </div>

          {item.regionVariants.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] italic">
              No regional variations. Uses default universal name.
            </p>
          ) : (
            <div className="space-y-1.5">
              {item.regionVariants.map((variant, vIdx) => (
                <div
                  key={`${variant.regionCode}-${vIdx}`}
                  className="flex items-center justify-between gap-2 p-1.5 rounded bg-[var(--surface-sunken)] text-xs border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[var(--palette-blue-700)] px-1 py-0.2 rounded bg-white border border-[var(--palette-blue-200)]">
                      {variant.regionCode}
                    </span>
                    <span className="text-[var(--text-tertiary)] font-normal">
                      {variant.regionName}:
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {variant.value}
                    </span>
                  </div>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(vIdx)}
                      className="text-[var(--text-tertiary)] hover:text-[var(--palette-rose-600)] p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Variant Form */}
          {isEditable && (
            <form onSubmit={handleAddVariant} className="flex items-center gap-2 pt-1">
              <select
                value={newRegionCode}
                onChange={(e) => {
                  const code = e.target.value;
                  setNewRegionCode(code);
                  const names: Record<string, string> = {
                    GB: 'United Kingdom',
                    US: 'United States',
                    NG: 'Nigeria',
                    GH: 'Ghana',
                    CA: 'Canada',
                  };
                  setNewRegionName(names[code] || code);
                }}
                className="text-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-1.5 py-1 text-[var(--text-secondary)]"
              >
                <option value="GB">GB - United Kingdom</option>
                <option value="US">US - United States</option>
                <option value="NG">NG - Nigeria</option>
                <option value="GH">GH - Ghana</option>
                <option value="CA">CA - Canada</option>
              </select>

              <input
                type="text"
                value={newRegionValue}
                onChange={(e) => setNewRegionValue(e.target.value)}
                placeholder="Localized equivalent name..."
                className="flex-1 text-xs bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded px-2 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                icon={<Plus className="w-3 h-3" />}
                disabled={!newRegionValue.trim()}
              >
                Add
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
