# Engineering Notes & Observations

---

## Part 1: UX/UI Observations

### 1. Strengths in the Prototype Design
- **Dual Perspective (Taxonomies vs. Items)**: The two-tab architecture solves an authentic workflow tension: curriculum leads typically think hierarchically ("Levels", "Exam Boards"), whereas search indexing engineers and tutors frequently need to query individual items across categories ("Where does Year 9 appear?").
- **Clean Density and Visual Contrast**: The design avoids unnecessary clutter, utilizing clear pill badges for classification types and subtle flag badges for regional localization.
- **Action Proximity**: Actions like viewing and editing are directly accessible on row hover, minimizing extraneous clicks for experienced operators.

### 2. Ambiguities in the Prototype
- **Draft Persistence & Navigation Safety**: The prototype lacked an explicit affordance for unsaved edits. If an administrator accidentally clicks outside the slide-over drawer or presses the Escape key while modifying curriculum structures, all in-progress changes could be discarded silently.
- **Workflow State Transitions**: The relationship between "Editor saves draft", "Pending change proposal", and "Canonical published version" was not immediately obvious in the static screens. It was unclear whether editors directly modified canonical records or if a staging queue existed.
- **Zero-Item Edge Cases**: While populated tables look structured, empty taxonomies (e.g. a newly created "Skills" taxonomy before items are attached) needed explicit visual handling so operators are prompted to add items rather than seeing broken table layouts.

### 3. Concrete Product Recommendations for Tuteria
1. **Batch Release Flow with Staging Queue**: Implement a staging workflow where editors propose changes into an audit queue, and publishers review and approve them before triggering an atomic semantic version release. This mirrors modern content operations and prevents partial broken releases in production.
2. **Dedicated Localization Matrix View**: As Tuteria expands across West Africa, the UK, and North America, a matrix comparison view showing equivalent grades side-by-side (e.g. Nigeria Primary 1-6 vs. British Years 2-7 vs. US Grades 1-6) would be highly valuable for curriculum architects.
3. **Change Impact Visualizer**: When an operator modifies a taxonomy name or removes an item, display a proactive warning indicating the downstream impact (e.g., *"Removing 'WAEC SSCE' will impact 412 active tutors and 1,840 student matching profiles"*).

---

## Part 2: AI Usage & Engineering Review

### 1. How AI Was Utilized in the Project
AI coding capabilities were used as an augmented pair programmer across:
- Rapid domain typing and boilerplate generation (`types.ts`, interface models).
- Extracting raw Figma/CSS color hexes into standardized CSS token variables.
- Generating comprehensive test fixtures representing realistic West African and international curriculum standards.
- Scaffolding Storybook meta objects and test suites for Vitest.

### 2. Where AI Excelled
- **Data Modeling & Transformation**: Translating raw requirements into clean, decoupled TypeScript interfaces (`Taxonomy`, `TaxonomyItem`, `TaxonomyChange`, `VersionHistoryEntry`).
- **Semantic Versioning Pure Functions**: Synthesizing the semver bumping and impact resolution math without runtime external dependencies.
- **Exhaustive Edge Case Generation**: Quickly producing diverse fixture data with multi-country localization variants (`NG`, `GB`, `US`, `GH`).

### 3. Where AI Fell Short & Concrete Examples of Correction
1. **TypeScript Set Derivation Error (`RegionFlags.tsx`)**:
   - *AI Output*: `const uniqueRegions = Array.from(new Set(variants.map((v) => v.regionCode.toUpperCase())));`
   - *Failure*: Under strict TypeScript compiler settings, `new Set(...)` inferred `unknown[]`, leading to `error TS2538: Type 'unknown' cannot be used as an index type` when indexing `REGION_FLAG_MAP`.
   - *Human Correction*: Diagnosed compiler error during `npm run lint` and added explicit generic typing `new Set<string>(...)` with an explicit string array annotation `const uniqueRegions: string[] = ...`.
2. **Dependency Version Mismatches in Storybook (`package.json`)**:
   - *AI Output*: Attempted to install `@storybook/addon-essentials@^10.6.0` alongside an environment with mismatched preview presets, leading to build crashes (`No matching export Icons in storybook/internal/components`).
   - *Human Correction*: Recognized the canonical stable release branch of Storybook 8 (`^8.6.14`), unified `storybook`, `@storybook/react-vite`, and `@storybook/addon-essentials` to matching `^8.6.14` versions, and rebuilt the static output cleanly.
3. **Draft Mutation vs. Pure Domain Separation**:
   - *AI Tendency*: AI initially wired form inputs directly to parent setter functions, mutating canonical table state before changes were confirmed.
   - *Human Correction*: Enforced the four-tier state architecture (Domain State, Workflow State, UI State, and Draft State), ensuring in-flight edits are isolated in `TaxonomyDrawer` local state and gated behind an `UnsavedChangesDialog`.

### 4. Reflection: How AI Changes Product Engineering
AI radically accelerates the typing, scaffolding, and syntactical phases of engineering. However, product craft, architectural boundaries (such as capability-based access control and state tiering), visual polish, anti-slop restraint, and defensive error handling remain fundamentally human responsibilities. The engineer's role shifts from writing repetitive lines to acting as an architect and meticulous reviewer who guarantees fidelity to real-world user intent.
