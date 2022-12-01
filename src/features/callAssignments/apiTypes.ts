import { ZetkinQuery, ZetkinTag } from 'utils/types/zetkin';

export interface CallAssignmentCaller {
  id: number;
  first_name: string;
  last_name: string;
  prioritized_tags: ZetkinTag[];
  excluded_tags: ZetkinTag[];
}

export interface CallAssignmentData {
  cooldown: number;
  id: number;
  target: ZetkinQuery;
  title: string;
}

export interface CallAssignmentStats {
  allTargets: number;
  allocated: number;
  blocked: number;
  callBackLater: number;
  calledTooRecently: number;
  done: number;
  isStale: boolean;
  missingPhoneNumber: number;
  organizerActionNeeded: number;
  queue: number;
  ready: number;
  isLoading: boolean;
}
