import React from 'react';
import { FlattenedItemView } from '../../model/taxonomy';
import { ItemRow } from './ItemRow';
import { PermissionCapabilities } from '../../model/permissions';

export interface ItemTableProps {
  items: FlattenedItemView[];
  capabilities: PermissionCapabilities;
  onOpenParentTaxonomy: (taxonomyId: string) => void;
  onEditItem?: (item: FlattenedItemView) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items,
  capabilities,
  onOpenParentTaxonomy,
  onEditItem,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-xs">
      <table className="w-full text-left border-collapse" id="items-table">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <th scope="col" className="py-3 px-5">
              Item Name
            </th>
            <th scope="col" className="py-3 px-4">
              Category
            </th>
            <th scope="col" className="py-3 px-4">
              Parent Taxonomy
            </th>
            <th scope="col" className="py-3 px-4">
              Type
            </th>
            <th scope="col" className="py-3 px-4">
              Regional Variants
            </th>
            <th scope="col" className="py-3 px-4 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--surface-raised)]">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              capabilities={capabilities}
              onOpenParentTaxonomy={onOpenParentParent => onOpenParentTaxonomy(item.taxonomyId)}
              onEditItem={onEditItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
