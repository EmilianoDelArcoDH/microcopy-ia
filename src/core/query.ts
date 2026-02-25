import type { ActivityId, LangCode, QueryState, Variant } from './types';

const DEFAULT_ACTIVITY: ActivityId = 'microcopy-ia-01';
const DEFAULT_LANG: LangCode = 'es';
const DEFAULT_VARIANT: Variant = 'src';

const ACTIVITIES: ActivityId[] = ['microcopy-ia-01', 'microcopy-ia-02', 'microcopy-ia-03'];
const LANGS: LangCode[] = ['es', 'en', 'pt'];
const VARIANTS: Variant[] = ['src', 'solution'];

export function leerQueryParams(search = window.location.search): QueryState {
  const params = new URLSearchParams(search);
  const a = params.get('a');
  const lang = params.get('lang');
  const variant = params.get('variant');

  return {
    a: ACTIVITIES.includes(a as ActivityId) ? (a as ActivityId) : DEFAULT_ACTIVITY,
    lang: LANGS.includes(lang as LangCode) ? (lang as LangCode) : DEFAULT_LANG,
    variant: VARIANTS.includes(variant as Variant) ? (variant as Variant) : DEFAULT_VARIANT,
  };
}

export function actualizarQueryParams(next: Partial<QueryState>): QueryState {
  const actual = leerQueryParams();
  const merged: QueryState = {
    ...actual,
    ...next,
  };

  const params = new URLSearchParams(window.location.search);
  params.set('a', merged.a);
  params.set('lang', merged.lang);
  params.set('variant', merged.variant);
  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', url);

  return merged;
}

export function activityStorageKey(query: QueryState): string {
  return `activity:${query.a}:${query.variant}:${query.lang}`;
}