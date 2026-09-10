/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaxonomiesPage } from './components/TaxonomiesPage';
import {
  CANONICAL_TAXONOMIES,
  CANONICAL_CHANGES,
  CANONICAL_VERSION_HISTORY,
  CANONICAL_VERSION,
} from './data/fixtures';

export default function App() {
  return (
    <TaxonomiesPage
      initialTaxonomies={CANONICAL_TAXONOMIES}
      initialChanges={CANONICAL_CHANGES}
      initialHistory={CANONICAL_VERSION_HISTORY}
      initialVersion={CANONICAL_VERSION}
      initialRole="publisher"
    />
  );
}


