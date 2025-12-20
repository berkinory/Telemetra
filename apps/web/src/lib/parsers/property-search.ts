import type { PropertySearchFilter } from '@phase/shared';
import { createParser } from 'nuqs';

export const parseAsPropertySearch = createParser<PropertySearchFilter>({
  parse(queryValue): PropertySearchFilter {
    if (!queryValue) {
      return [];
    }

    try {
      const decoded = atob(queryValue);
      const parsed = JSON.parse(decoded);

      if (!Array.isArray(parsed)) {
        return [];
      }

      const isValid = parsed.every(
        (condition: unknown) =>
          typeof condition === 'object' &&
          condition !== null &&
          'key' in condition &&
          'operator' in condition &&
          'value' in condition
      );

      return isValid ? (parsed as PropertySearchFilter) : [];
    } catch {
      return [];
    }
  },

  serialize(value: PropertySearchFilter): string {
    if (!value || value.length === 0) {
      return '';
    }

    try {
      const json = JSON.stringify(value);
      return btoa(json);
    } catch {
      return '';
    }
  },
}).withDefault([]);
