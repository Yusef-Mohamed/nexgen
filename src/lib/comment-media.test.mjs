import test from 'node:test';
import assert from 'node:assert/strict';
import {commentImages,commentFormData,commentTimestamp} from './comment-media.ts';
test('legacy and multiple comment images are displayed once',()=>{
  assert.deepEqual(commentImages({image:'a',images:['a','b']}),['a','b']);
  assert.deepEqual(commentImages({image:'a'}),['a']);
});
test('multipart includes all selected images and permits an image-only reply',()=>{
  const images=[new File(['a'],'a.png'),new File(['b'],'b.png')];
  const body=commentFormData('',images);
  assert.equal(body.get('content'),'');
  assert.deepEqual(body.getAll('images').map(file=>file.name),['a.png','b.png']);
  assert.throws(()=>commentFormData('',Array(11).fill(images[0])));
});
test('English and Arabic comment timestamps include hours and minutes',()=>{
  for(const locale of ['ar','en'])assert.match(commentTimestamp('2026-10-12T13:05:00Z',locale),/[:：]/);
  assert.equal(commentTimestamp('invalid','en'),'');
});
