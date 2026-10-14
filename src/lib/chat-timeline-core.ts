// Kept identical in Mobile and Website; no native, React, or credential state.
export type TimelineMessage = { _id: string; createdAt: string; chatVersion?: number; _cursor: string; repliedTo?: { _id: string; [field: string]: unknown } | null };
export type TimelinePage<T> = {
  data: T[]; olderCursor: string | null; newerCursor: string | null;
  hasOlder: boolean; hasNewer: boolean; latestCursor: string | null;
  conversation?: Record<string, unknown>;
};
export type TimelineChange = { chatId?: string; messageId?: string; kind?: string };
export type TimelineState<T> = {
  rows: T[]; summary?: Record<string, unknown>; hasOlder: boolean; hasNewer: boolean;
  loading: boolean; olderLoading: boolean; newerLoading: boolean; syncing: boolean;
  error: unknown; olderError: unknown; newerError: unknown; valid: boolean;
};
export type TimelineTransport<T> = {
  page: (options: { around?: string; before?: string; after?: string }, signal: AbortSignal) => Promise<TimelinePage<T>>;
  sync: (known: { id: string; version: number }[], latest: boolean, signal: AbortSignal) => Promise<{ data: T[]; removedIds: string[]; latest: TimelinePage<T> | null }>;
  accessDenied: (error: unknown) => boolean;
};
const compare = (a: TimelineMessage, b: TimelineMessage) => a.createdAt.localeCompare(b.createdAt) || a._id.localeCompare(b._id);
const initial = <T>(): TimelineState<T> => ({ rows: [], hasOlder: false, hasNewer: false, loading: false, olderLoading: false, newerLoading: false, syncing: false, error: null, olderError: null, newerError: null, valid: true });

export class ChatTimeline<T extends TimelineMessage> {
  private state = initial<T>();
  private listeners = new Set<() => void>();
  private records = new Map<string, T>();
  private latest: TimelinePage<T> | null = null;
  private older: string | null = null;
  private newer: string | null = null;
  private epoch = 0;
  private revision = 0;
  private controller = new AbortController();
  private pagination = false;
  private pendingSync = false;
  private needsLatest = false;
  private dirty = new Set<string>();
  private timer?: ReturnType<typeof setTimeout>;
  private target?: string;
  private opened = false;
  private syncAgain = false;
  lastUsed = Date.now();
  anchor: { id: string; offset: number } | null = null;
  atLiveEnd = false;
  constructor(private transport: TimelineTransport<T>) {}
  setAnchor(anchor: { id: string; offset: number } | null) { this.anchor = anchor; }
  setLiveEnd(value: boolean) { this.atLiveEnd = value; }
  setTransport(transport: TimelineTransport<T>) { this.transport = transport; }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); this.lastUsed = Date.now(); }; };
  get active() { return this.listeners.size > 0; }
  private publish(patch: Partial<TimelineState<T>>) {
    this.state = { ...this.state, ...patch }; this.lastUsed = Date.now();
    this.listeners.forEach(listener => listener());
  }
  private put(messages: T[]) {
    return messages.map(message => {
      const old = this.records.get(message._id);
      if (old && (old.chatVersion || 0) >= (message.chatVersion || 0)) return old;
      this.records.set(message._id, message); return message;
    });
  }
  private prune() {
    const keep = new Set([...this.state.rows.map(row => row._id), ...(this.latest?.data.map(row => row._id) || [])]);
    for (const id of this.records.keys()) if (!keep.has(id)) this.records.delete(id);
  }
  private install(page: TimelinePage<T>, direction?: "older" | "newer") {
    const incoming = this.put(page.data);
    let rows = direction ? [...new Map([...this.state.rows, ...incoming].map(row => [row._id, this.records.get(row._id)!])).values()].sort(compare) : incoming;
    let hasOlder = direction === "newer" ? this.state.hasOlder : page.hasOlder;
    let hasNewer = direction === "older" ? this.state.hasNewer : page.hasNewer;
    if (rows.length > 200) {
      if (direction === "older") { rows = rows.slice(0, 200); hasNewer = true; }
      else { rows = rows.slice(-200); hasOlder = true; }
    }
    this.older = rows[0]?._cursor || page.olderCursor;
    this.newer = rows.at(-1)?._cursor || page.newerCursor;
    if (!page.hasNewer && (incoming.length || !direction)) this.latest = { ...page, data: incoming.slice(-40) };
    this.publish({ rows, hasOlder, hasNewer, summary: page.conversation || this.state.summary, valid: true, error: null });
    this.prune();
  }
  async open(target?: string) {
    if (this.opened && this.target === target && this.state.rows.length && this.state.valid &&
      (!target || this.state.rows.some(row => row._id === target))) return;
    if (this.opened && this.target === target && this.state.loading) return;
    this.target = target; this.opened = true;
    if (this.state.rows.length && !this.state.valid) {
      await this.revalidate();
      if (this.state.valid && (!target || this.state.rows.some(row => row._id === target))) return;
    }
    if (target && this.state.valid && this.state.rows.some(row => row._id === target)) return;
    await this.load(target ? { around: target } : {});
  }
  private async load(options: { around?: string; before?: string; after?: string }, direction?: "older" | "newer") {
    if (direction && (this.pagination || this.state.loading || this.state.syncing)) return;
    if (!direction) {
      this.controller.abort(); this.controller = new AbortController(); this.epoch++; this.pagination = false;
      this.publish({ syncing: false, olderLoading: false, newerLoading: false });
    }
    this.pagination = true;
    const epoch = this.epoch, revision = this.revision;
    this.publish(direction === "older" ? { olderLoading: true, olderError: null } : direction === "newer" ? { newerLoading: true, newerError: null } : { loading: true, error: null });
    try {
      const page = await this.transport.page(options, this.controller.signal);
      if (epoch !== this.epoch) return;
      this.install(page, direction);
      if (revision !== this.revision) { this.pendingSync = true; this.needsLatest = true; }
    } catch (error) {
      if (epoch !== this.epoch || this.controller.signal.aborted) return;
      if (this.transport.accessDenied(error)) this.clear(error);
      else this.publish(direction === "older" ? { olderError: error } : direction === "newer" ? { newerError: error } : { error });
    } finally {
      if (epoch === this.epoch) {
        this.pagination = false;
        this.publish({ loading: false, olderLoading: false, newerLoading: false });
        if (this.pendingSync) this.schedule();
      }
    }
  }
  olderPage = () => this.state.hasOlder && this.older ? this.load({ before: this.older }, "older") : Promise.resolve();
  newerPage = () => this.state.hasNewer && this.newer ? this.load({ after: this.newer }, "newer") : Promise.resolve();
  retry = () => this.load(this.target ? { around: this.target } : {});
  async jumpLatest(force = false) {
    this.target = undefined; this.opened = true; this.anchor = null; this.atLiveEnd = true;
    if (!force && this.latest && this.state.valid && !this.pendingSync && !this.state.syncing) {
      this.controller.abort(); this.controller = new AbortController(); this.epoch++;
      this.pagination = false;
      this.install(this.latest);
      this.publish({ loading: false, olderLoading: false, newerLoading: false });
      return;
    }
    await this.load({});
  }
  sent(message: T) {
    this.target = undefined; this.opened = true; this.anchor = null;
    this.controller.abort(); this.controller = new AbortController(); this.epoch++;
    this.pagination = false;
    this.atLiveEnd = true;
    this.install({ data: [message], olderCursor: message._cursor, newerCursor: message._cursor, latestCursor: message._cursor, hasOlder: true, hasNewer: true });
    this.publish({ loading: false, olderLoading: false, newerLoading: false, syncing: false });
    void this.load({});
  }
  changed(change: TimelineChange = {}) {
    this.revision++;
    if (change.messageId) for (const row of this.records.values()) {
      if (row._id === change.messageId || row.repliedTo?._id === change.messageId) this.dirty.add(row._id);
    }
    if (!change.messageId) for (const id of this.records.keys()) this.dirty.add(id);
    this.needsLatest ||= !change.kind || change.kind === "sendMessage" || change.kind === "deleteMessage";
    this.pendingSync = true;
    if (this.active) this.schedule();
    else this.publish({ valid: false });
  }
  private schedule() {
    if (this.timer || !this.active) return;
    this.timer = setTimeout(() => { this.timer = undefined; void this.flush(); }, 100);
  }
  async revalidate() {
    this.revision++;
    for (const id of this.records.keys()) this.dirty.add(id);
    this.pendingSync = true; this.needsLatest = true;
    await this.flush();
  }
  invalidate(reconcile = true) {
    this.publish({ valid: false });
    if (reconcile && this.active) void this.revalidate();
  }
  resetSafety() {
    const target = this.target;
    this.clear();
    if (this.active) void this.open(target);
  }
  private async flush() {
    if (this.pagination || this.state.loading) return;
    if (this.state.syncing) { this.syncAgain = true; return; }
    if (!this.state.rows.length) {
      const latest = this.needsLatest;
      this.pendingSync = false; this.needsLatest = false;
      if (latest) await this.load(this.target ? { around: this.target } : {});
      return;
    }
    const epoch = this.epoch, revision = this.revision;
    const ids = [...this.dirty]; this.dirty.clear();
    const latest = this.needsLatest; this.needsLatest = false; this.pendingSync = false;
    const known = ids.flatMap(id => { const row = this.records.get(id); return row ? [{ id, version: row.chatVersion || 0 }] : []; });
    this.publish({ syncing: true });
    try {
      const result = await this.transport.sync(known, latest, this.controller.signal);
      if (epoch !== this.epoch) return;
      if (revision !== this.revision) { ids.forEach(id => this.dirty.add(id)); this.pendingSync = true; this.needsLatest ||= latest; return; }
      result.removedIds.forEach(id => this.records.delete(id));
      this.put(result.data);
      let rows = this.state.rows.filter(row => !result.removedIds.includes(row._id)).map(row => this.records.get(row._id)!);
      let hasNewer = this.state.hasNewer, hasOlder = this.state.hasOlder;
      if (result.latest) {
        const fresh = this.put(result.latest.data);
        this.latest = { ...result.latest, data: fresh };
        const overlaps = fresh.some(row => rows.some(current => current._id === row._id));
        if (overlaps) {
          rows = [...new Map([...rows, ...fresh].map(row => [row._id, this.records.get(row._id)!])).values()].sort(compare);
          // Keep the reader's section fixed if adding the live tail would evict it.
          if (rows.length > 200) {
            if (this.atLiveEnd && !this.state.hasNewer) { rows = rows.slice(-200); hasOlder = true; }
            else rows = rows.slice(0, 200);
            hasNewer = rows.at(-1)?._cursor !== result.latest.latestCursor;
          }
          else hasNewer = result.latest.hasNewer;
        } else if (this.atLiveEnd && !this.state.hasNewer) {
          // A burst can exceed one batch. Replace the live section instead of
          // rendering a false adjacency across messages we never fetched.
          rows = fresh; hasOlder = result.latest.hasOlder; hasNewer = result.latest.hasNewer;
        } else hasNewer = rows.at(-1)?._cursor !== result.latest.latestCursor;
      }
      this.older = rows[0]?._cursor || this.older;
      this.newer = rows.at(-1)?._cursor || this.newer;
      this.publish({ rows, hasOlder, hasNewer, valid: true, error: null }); this.prune();
    } catch (error) {
      if (epoch !== this.epoch || this.controller.signal.aborted) return;
      if (this.transport.accessDenied(error)) this.clear(error);
      else { ids.forEach(id => this.dirty.add(id)); this.needsLatest ||= latest; this.pendingSync = true; this.publish({ error }); }
    } finally {
      if (epoch === this.epoch) {
        this.publish({ syncing: false });
        if (this.syncAgain || revision !== this.revision) { this.syncAgain = false; this.schedule(); }
      }
    }
  }
  clear(error: unknown = null) {
    this.controller.abort(); this.controller = new AbortController(); this.epoch++;
    if (this.timer) clearTimeout(this.timer); this.timer = undefined;
    this.records.clear(); this.latest = null; this.older = null; this.newer = null;
    this.dirty.clear(); this.pendingSync = false; this.needsLatest = false; this.pagination = false; this.syncAgain = false; this.atLiveEnd = false;
    this.opened = false; this.anchor = null; this.state = initial<T>(); this.publish({ error });
  }
  dispose() { this.clear(); this.listeners.clear(); }
}

export class TimelineCache<T extends TimelineMessage> {
  private entries = new Map<string, ChatTimeline<T>>();
  get(key: string, transport: () => TimelineTransport<T>) {
    const now = Date.now();
    for (const [id, entry] of this.entries) if (!entry.active && now - entry.lastUsed > 600000) { entry.dispose(); this.entries.delete(id); }
    let entry = this.entries.get(key);
    if (!entry) {
      while (this.entries.size >= 5) {
        const oldest = [...this.entries].filter(([, value]) => !value.active).sort((a, b) => a[1].lastUsed - b[1].lastUsed)[0];
        if (!oldest) break;
        oldest[1].dispose(); this.entries.delete(oldest[0]);
      }
      entry = new ChatTimeline(transport()); this.entries.set(key, entry);
    } else entry.setTransport(transport());
    entry.lastUsed = now; return entry;
  }
  changed(account: string, change: TimelineChange) {
    for (const [key, entry] of this.entries) if (key.startsWith(account + ":") && (!change.chatId || key === account + ":" + change.chatId)) entry.changed(change);
  }
  invalidate(account: string, reconcile = true) { for (const [key, entry] of this.entries) if (key.startsWith(account + ":")) entry.invalidate(reconcile); }
  clear(account?: string) {
    for (const [key, entry] of this.entries) if (!account || key.startsWith(account + ":")) { entry.dispose(); this.entries.delete(key); }
  }
  resetSafety(account?: string) { for (const [key, entry] of this.entries) if (!account || key.startsWith(account + ":")) entry.resetSafety(); }
}
