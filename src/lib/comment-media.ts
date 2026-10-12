export const COMMENT_IMAGE_LIMIT = 10;
export function commentImages(comment: {image?: string | null; images?: string[]}) {
  return [...new Set([comment.image, ...(comment.images || [])].filter((url): url is string => Boolean(url)))];
}
export function commentFormData(content: string, images: File[] = []) {
  if(images.length>COMMENT_IMAGE_LIMIT)throw new Error('COMMENT_IMAGES_LIMIT');
  const body=new FormData();
  body.append('content',content.trim());
  images.forEach(image=>body.append('images',image));
  return body;
}
export function commentTimestamp(value: string, locale: string) {
  const date=new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(locale==='ar'?'ar-EG':'en-GB',{
    year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',
  }).format(date);
}
