import { TimelineCache, type TimelineMessage } from './chat-timeline-core';
import type { IMessage } from '@/types';
export type WireMessage = IMessage & TimelineMessage;
export const timelines = new TimelineCache<WireMessage>();
