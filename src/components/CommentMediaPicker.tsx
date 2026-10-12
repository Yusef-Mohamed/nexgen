"use client";
import {useEffect,useRef,type Dispatch,type SetStateAction} from 'react';
import {useLocale} from 'next-intl';
import {X} from 'lucide-react';

export function CommentMediaPicker({files,setFiles,disabled}:{files:File[]|null;setFiles:Dispatch<SetStateAction<File[]|null>>;disabled:boolean}) {
  const locale=useLocale();
  if(!files?.length)return null;
  return <div className="flex flex-wrap gap-2 px-3 py-2" aria-label={locale==='ar'?'الصور المرفقة':'Attached images'}>
    {files.map((file,index)=><div key={`${file.name}-${index}`} className="relative">
      <FilePreview file={file} alt={locale==='ar'?`الصورة ${index+1}`:`Image ${index+1}`} />
      <button type="button" disabled={disabled} aria-label={locale==='ar'?`إزالة الصورة ${index+1}`:`Remove image ${index+1}`} onClick={()=>setFiles(previous=>(previous||[]).filter((_,i)=>i!==index))} className="absolute -end-1 -top-1 rounded-full bg-background p-1 text-text-1 shadow"><X size={16}/></button>
    </div>)}
  </div>;
}

function FilePreview({file,alt}:{file:File;alt:string}) {
  const image=useRef<HTMLImageElement>(null);
  useEffect(()=>{const url=URL.createObjectURL(file);if(image.current)image.current.src=url;return()=>URL.revokeObjectURL(url);},[file]);
  // Local object URLs cannot use the Next.js image optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={image} alt={alt} width={72} height={72} className="size-18 rounded-lg object-cover"/>;
}
