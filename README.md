# Tuteria Taxonomies Management System

A reusable React + TypeScript component library and management interface for Tuteria's educational taxonomies, curriculum classifications, examination boards, and international localization.

Built according to the Product Engineer Case Study brief and prototype specifications.

- **Live Application**: [https://ais-pre-6vekuh37djblu3apawk2r6-110462835010.europe-west2.run.app](https://ais-pre-6vekuh37djblu3apawk2r6-110462835010.europe-west2.run.app)
- **GitHub Repository**: [https://github.com/oluwatonisobande/tuteria-taxonomies](https://github.com/oluwatonisobande/tuteria-taxonomies)

---

## 1. Overview & Problem Context

Educational tutoring platforms like Tuteria operate across diverse educational standards (e.g., Nigerian National Curriculum, British National Curriculum, American AP/College Board, West African WAEC/NECO, and Ghanaian BECE). 

A centralized **Taxonomies Management System** provides:
- **Canonical educational classification**: Standardized definitions of grade levels, academic terms, exam boards, and pedagogical goals.
- **Cross-regional equivalence mapping**: Explicit localization variants (e.g., *Primary 1* in Nigeria mapped to *Year 2* in the UK, or *JSS 3* mapped to *Year 9* / *Grade 8*).
- **Safe versioned releases**: A capability-gated workflow ensuring changes staged by editors require publisher approval before bumping semantic versions and affecting live tutoring services.

---

## 2. Architecture & Design Decisions

```
                           [ TaxonomiesPage ]
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
   [ PageHeader ]          [ TaxonomyTabs ]       [ TaxonomyToolbar ]
 (Version, Role, Stats)    (Taxonomies / Items)   (Search & Type/Cat filters)
         │
         ├────────────────────────────────────────────────┐
         ▼                                                ▼
  [ TaxonomyTable ]                                 [ ItemTable ]
         │                                                │
  [ TaxonomyRow ]                                    [ ItemRow ]
         │                                                │
 ┌───────┴──────────────────────────────┐                 │
 ▼               ▼               ▼      ▼                 ▼
[TypePill] [CategoryPill] [RegionFlags] [ItemCount]   [ParentTaxonomyLink]

                     ── Workflow & Overlays ──
  ┌──────────────────────┬──────────────────────┬──────────────────────┐
  ▼                      ▼                      ▼                      ▼
[TaxonomyDrawer]   [ReviewDrawer]    [VersionHistoryDrawer]   [PublishDialog]
(View / Edit Draft) (Pending Changes)  (Immutable Audit Log)   (Impact Bump)
```

### State Management Strategy
State is partitioned into four distinct layers to prevent coupling and race conditions:
1. **Domain State**: The canonical array of `Taxonomy` records and their child `TaxonomyItem`s.
2. **Workflow State**: Staged `TaxonomyChange` proposals (`pending` vs. `accepted`) with assigned semantic version impacts (`patch`, `minor`, `major`).
3. **UI State**: Transient view choices such as active tab (`taxonomies` | `items`), filter criteria, search query, active user role (`publisher` | `editor` | `view_only` | `no_access`), and open overlay flags.
4. **Draft State**: Encapsulated within `TaxonomyDrawer`. Any in-progress edits to name, type, description, source, or items are kept in local component state until explicitly saved or proposed. A dirty flag guards against accidental dismissal with an unsaved changes confirmation dialog.

### Design Token Extraction
All visual constants from the Tuteria brand and prototype were extracted into semantic CSS custom properties in `src/styles/tokens.css`:
- **Palette**: Slate/Neutral for structural surfaces; Blue (700/800) for primary actions and active tabs; Emerald for approved statuses; Amber for pending reviews; Rose for deletions/danger.
- **Typography**: Display font paired with clean body text, adhering to strict line-height (1.5–1.7) and mathematical step scales.
- **Spacing**: Rigid 2x horizontal padding rule for buttons, mathematically calculated inner/outer border-radii (`Inner Radius = Outer Radius - Padding`).

### Pure Semantic Versioning Engine (`src/model/versioning.ts`)
Version calculations are isolated in testable, pure functions:
- `bumpVersion(semver, 'patch' | 'minor' | 'major')`
- `getHighestImpact(impactArray)`
- `parseSemver(string)` / `formatSemver(semver)`

### Role-to-Capability Model (`src/model/permissions.ts`)
Components never inspect raw role strings directly. Instead, roles map to boolean capabilities:
```typescript
interface PermissionCapabilities {
  canView: boolean;
  canEdit: boolean;
  canReview: boolean;
  canPublish: boolean;
}
```

---

## 3. Business Rules & Version Impact Mapping

### Assessment Specification vs. Implementation Decisions

The assessment brief explicitly defines required version bump rules for core actions. Where the specification did not define an edge case (such as updating a taxonomy's `type`), a defensible engineering assumption was applied:

- **Explicitly Defined by Assessment Specification**:
  - Taxonomy `name` or `description` update → **Patch**
  - Item addition or removal → **Minor**
  - Item regional variant additions/updates → **Patch**
  - Taxonomy addition (`create`) or removal (`remove`) → **Major**
  - Staged publish release → Atomic batch increment calculated from highest-impact change
- **Implementation Assumption**:
  - Taxonomy `type` update → **Major** (*"Type changes are treated as major as an implementation assumption because they alter the taxonomy's semantic classification."*)

| Entity Type | Action | Affected Field | Version Impact | Classification Origin | Rationale & Behavioral Notes |
|:---|:---|:---|:---:|:---:|:---|
| **Taxonomy** | `create` | All | **Major** | Specification | Introducing a top-level taxonomy establishes a new classification axis. |
| **Taxonomy** | `remove` | All | **Major** | Specification | Removing a taxonomy can break dependent subject trees and queries. |
| **Taxonomy** | `update` | `type` | **Major** | **Assumption** | *Type changes are treated as major as an implementation assumption because they alter the taxonomy's semantic classification.* |
| **Taxonomy** | `update` | `name` | **Patch** | Specification | Display label refinement with preserved semantic identifiers. |
| **Taxonomy** | `update` | `description` | **Patch** | Specification | Explanatory documentation update. |
| **Item** | `create` | All | **Minor** | Specification | Introducing a new grade level or exam board adds backward-compatible capabilities. |
| **Item** | `remove` | All | **Minor** | Specification | Removing an item deprecates a classification value. |
| **Item** | `update` | Regional variants | **Patch** | Specification | Localized text alias refinement without hierarchy changes. |

---

## 4. Component Catalogue

| Component | Path | Role / Purpose | Key States | Story |
|:---|:---|:---|:---|:---|
| `TypePill` | `src/components/primitives/TypePill.tsx` | Visual tag for taxonomy types | 6 Type variants | `Design System / Primitives / TypePill` |
| `CategoryPill` | `src/components/primitives/CategoryPill.tsx` | Category badge & count list | Single, Few, Overflow (+N), Empty | `Design System / Primitives / CategoryPill` |
| `RegionFlags` | `src/components/primitives/RegionFlags.tsx` | Country flag badges for regional variants | Universal (none), Single, Multi-country | Incorporated in table rows |
| `Button` | `src/components/primitives/Button.tsx` | Primary/Secondary/Ghost/Danger action buttons | Default, Hover, Loading, Disabled | `Design System / Primitives / Button` |
| `Drawer` | `src/components/primitives/Drawer.tsx` | Accessible slide-over overlay with focus trap & Esc key | Open, Closing, Responsive sizes | Primitives |
| `TaxonomyRow` | `src/components/taxonomy/TaxonomyRow.tsx` | Reusable data row for the Taxonomies table | Default, ViewOnly, Empty items, Actions | `Components / Taxonomy / TaxonomyRow` |
| `TaxonomyTable` | `src/components/taxonomy/TaxonomyTable.tsx` | Master data table rendering taxonomy records | Populated, ViewOnly, Empty | `Components / Taxonomy / TaxonomyTable` |
| `ItemRow` | `src/components/item/ItemRow.tsx` | Independent item row with clickable parent link | Default, Multi-region, Hover actions | `Components / Item / ItemRow` |
| `ItemTable` | `src/components/item/ItemTable.tsx` | Flattened cross-taxonomy items table | Populated, ViewOnly | `Components / Item / ItemTable` |
| `TaxonomyDrawer` | `src/components/drawer/TaxonomyDrawer.tsx` | Slide-over drawer for viewing, editing, and staging | View mode, Edit mode, Create mode, Unsaved alert | `Components / Drawer / TaxonomyDrawer` |
| `ReviewDrawer` | `src/components/workflow/ReviewDrawer.tsx` | Queue of pending proposals and accepted changes | Publisher review, Editor view, Empty | `Workflow / ReviewDrawer` |
| `VersionHistoryDrawer` | `src/components/workflow/VersionHistoryDrawer.tsx` | Immutable audit log of releases and changes | Multi-release, Single release | `Workflow / VersionHistoryDrawer` |
| `PublishDialog` | `src/components/workflow/PublishDialog.tsx` | Release confirmation modal with semver bump calculation | Interactive batch publish modal | Part of workflow |
| `TaxonomiesPage` | `src/components/TaxonomiesPage.tsx` | Master view integrating layout, tabs, table, and overlays | Publisher, Editor, ViewOnly, NoAccess, Empty | `Pages / TaxonomiesPage` |

---

## 5. Inconsistencies & Assumptions

1. **Items Tab Navigation**: In the prototype, clicking a parent taxonomy inside the Items tab was visually suggested. **Decision**: Implemented an explicit actionable button that opens the parent taxonomy directly in `TaxonomyDrawer`, giving administrators instant access to context.
2. **Version Bump Granularity**: The prototype was ambiguous about whether multiple pending changes trigger sequential version bumps or a single batch bump. **Decision**: Implemented batching logic: when a publisher clicks "Publish", all accepted staged changes are bundled into a single release, with the version increment determined by the highest-impact change in the batch (`getHighestImpact(impacts)`).
3. **Regional Variant Editing**: The prototype displayed regional tags (e.g., `NG`, `GB`) as static indicators. **Decision**: Built a full interactive editor allowing operators to add, inspect, and remove localized equivalent names per country code.
4. **Draft Protection**: The prototype permitted closing drawers while typing. **Decision**: Introduced an `UnsavedChangesDialog` to safeguard against accidental data loss when the drawer is dirty.
5. **Taxonomy Type Mutation Impact**: The assessment specification explicitly provides rules for name/description edits, item add/remove, and taxonomy add/remove, but leaves taxonomy `type` alteration unspecified. **Decision**: *Type changes are treated as major as an implementation assumption because they alter the taxonomy's semantic classification* across Tuteria's downstream query pipelines.

---

## 6. Getting Started

### Development
```bash
npm run dev
```
Starts the local dev server at `http://localhost:3000`.

### Unit Tests
```bash
npm run test
```
Executes Vitest suite covering version impact calculation, semantic version bumping, permission capabilities, search filtering, and validation rules.

### Storybook
```bash
npm run storybook
```
Launches Storybook at `http://localhost:6006` to inspect component states, edge cases, and documentation.
