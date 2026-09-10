import React from 'react';
import { Taxonomy } from '../../model/taxonomy';
import { TaxonomyRow } from './TaxonomyRow';
import { PermissionCapabilities } from '../../model/permissions';

export interface TaxonomyTableProps {
  taxonomies: Taxonomy[];
  capabilities: PermissionCapabilities;
  onSelectTaxonomy: (taxonomy: Taxonomy) => void;
  onEditTaxonomy?: (taxonomy: Taxonomy) => void;
  onDeleteTaxonomy?: (taxonomy: Taxonomy) => void;
}

export const TaxonomyTable: React.FC<TaxonomyTableProps> = ({
  taxonomies,
  capabilities,
  onSelectTaxonomy,
  onEditTaxonomy,
  onDeleteTaxonomy,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-xs">
      <table className="w-full text-left border-collapse" id="taxonomies-table">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <th scope="col" className="py-3 px-5">
              Taxonomy Name & Program
            </th>
            <th scope="col" className="py-3 px-4">
              Type
            </th>
            <th scope="col" className="py-3 px-4">
              Items
            </th>
            <th scope="col" className="py-3 px-4">
              Categories
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
          {taxonomies.map((taxonomy) => (
            <TaxonomyRow
              key={taxonomy.id}
              taxonomy={taxonomy}
              capabilities={capabilities}
              onSelect={onSelectTaxonomy}
              onEdit={onEditTaxonomy}
              onDelete={onDeleteTaxonomy}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
