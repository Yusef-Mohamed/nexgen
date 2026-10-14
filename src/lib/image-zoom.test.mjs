import test from 'node:test';
import assert from 'node:assert/strict';
import { ImageZoom } from './image-zoom.ts';

test('pinch keeps the point under the fingers stable and allows panning', () => {
  const model = new ImageZoom();
  model.resize({ width: 400, height: 400 }, { width: 1000, height: 1000 });
  model.begin([{ x: 0, y: 0 }, { x: 100, y: 0 }]);
  model.move([{ x: -50, y: 0 }, { x: 150, y: 0 }]);
  assert.deepEqual(model.value, { scale: 2, x: -50, y: 0 });
  model.begin([{ x: 100, y: 0 }]);
  model.move([{ x: 130, y: 40 }]);
  assert.deepEqual(model.value, { scale: 2, x: -20, y: 40 });
});

test('pan is constrained to actual contained image, and reset returns to fit', () => {
  const model = new ImageZoom();
  model.resize({ width: 400, height: 600 }, { width: 1200, height: 600 });
  model.zoom(2);
  model.begin([{ x: 0, y: 0 }]);
  model.move([{ x: 9999, y: -9999 }]);
  assert.deepEqual(model.value, { scale: 2, x: 200, y: 0 });
  model.reset(); assert.deepEqual(model.value, { scale: 1, x: 0, y: 0 });
  assert.equal(model.zoom(100).scale, 5);
  assert.equal(model.zoom(0).scale, 1);
});

test('adding or lifting a finger rebases the gesture without a jump', () => {
  const model = new ImageZoom();
  model.resize({ width: 400, height: 400 }); model.zoom(2);
  model.begin([{ x: 0, y: 0 }]); model.move([{ x: 30, y: 0 }]);
  const before = { ...model.value };
  model.move([{ x: 30, y: 0 }, { x: 100, y: 0 }]); assert.deepEqual(model.value, before);
  model.move([{ x: 40, y: 0 }]); assert.deepEqual(model.value, before);
  model.move([{ x: 50, y: 0 }]); assert.equal(model.value.x, before.x + 10);
});

test('resize and late image dimensions clamp existing zoom without stale gesture jumps', () => {
  const model = new ImageZoom();
  model.resize({ width: 400, height: 400 }); model.zoom(3);
  model.begin([{ x: 0, y: 0 }]); model.move([{ x: 300, y: 300 }]);
  model.resize({ width: 800, height: 400 }, { width: 400, height: 800 });
  assert.equal(model.value.scale, 3); assert.equal(model.value.x, 0);
  const before = { ...model.value }; model.move([{ x: -300, y: -300 }]);
  assert.deepEqual(model.value, before);
});
