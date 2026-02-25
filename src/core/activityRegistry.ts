import { activityMicrocopyIA01 } from '../activities/microcopy-ia-01';
import { activityMicrocopyIA02 } from '../activities/microcopy-ia-02';
import { activityMicrocopyIA03 } from '../activities/microcopy-ia-03';
import type { ActivityConfig, ActivityId } from './types';

export const ACTIVITY_REGISTRY: Record<ActivityId, ActivityConfig> = {
  'microcopy-ia-01': activityMicrocopyIA01,
  'microcopy-ia-02': activityMicrocopyIA02,
  'microcopy-ia-03': activityMicrocopyIA03,
};