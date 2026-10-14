export type ZoomPoint = { x: number; y: number };
type Size = { width: number; height: number };
type Transform = { scale: number; x: number; y: number };
const clamp = (value: number, limit: number) => limit === 0 ? 0 : Math.max(-limit, Math.min(limit, value));
const center = (points: ZoomPoint[]) => points.length > 1
  ? { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }
  : points[0];
const distance = (points: ZoomPoint[]) => points.length > 1
  ? Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) : 0;

/** Coordinates are relative to the viewport center, independent of layout direction. */
export class ImageZoom {
  value: Transform = { scale: 1, x: 0, y: 0 };
  viewport: Size = { width: 1, height: 1 };
  private image: Size = { width: 1, height: 1 };
  private start: { points: ZoomPoint[]; value: Transform } | null = null;

  resize(viewport: Size, image?: Size) {
    if (viewport.width <= 0 || viewport.height <= 0) return this.value;
    this.viewport = viewport;
    if (image && image.width > 0 && image.height > 0) this.image = image;
    this.start = null;
    return this.constrain(this.value);
  }

  private constrain(next: Transform) {
    const scale = Math.max(1, Math.min(5, next.scale));
    const fit = Math.min(this.viewport.width / this.image.width, this.viewport.height / this.image.height);
    this.value = {
      scale,
      x: clamp(next.x, Math.max(0, (this.image.width * fit * scale - this.viewport.width) / 2)),
      y: clamp(next.y, Math.max(0, (this.image.height * fit * scale - this.viewport.height) / 2)),
    };
    return this.value;
  }

  zoom(scale: number, point: ZoomPoint = { x: 0, y: 0 }) {
    const ratio = Math.max(1, Math.min(5, scale)) / this.value.scale;
    this.start = null;
    return this.constrain({ scale: this.value.scale * ratio,
      x: point.x + (this.value.x - point.x) * ratio,
      y: point.y + (this.value.y - point.y) * ratio });
  }

  reset() { this.start = null; return this.constrain({ scale: 1, x: 0, y: 0 }); }

  begin(points: ZoomPoint[]) {
    this.start = points.length ? { points: points.slice(0, 2).map(p => ({ ...p })), value: { ...this.value } } : null;
  }

  move(points: ZoomPoint[]) {
    points = points.slice(0, 2);
    if (!points.length) return this.value;
    if (!this.start || this.start.points.length !== points.length) {
      this.begin(points);
      return this.value;
    }
    const previous = center(this.start.points), current = center(points);
    const original = this.start.value;
    const span = distance(this.start.points);
    const scale = span > 0 ? Math.max(1, Math.min(5, original.scale * distance(points) / span)) : original.scale;
    const ratio = scale / original.scale;
    return this.constrain({ scale,
      x: current.x + (original.x - previous.x) * ratio,
      y: current.y + (original.y - previous.y) * ratio });
  }
}
