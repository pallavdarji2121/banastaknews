'use client';
import {useEffect} from 'react';
// Shrinks big phone photos BEFORE upload (max 1600px, JPEG). Upload becomes 5-10x faster
// and the site loads faster because stored images are small. Works on every <input type=file> automatically.
export default function ImgCompress(){useEffect(()=>{
  const on=async(e:Event)=>{const i=e.target as HTMLInputElement;if(!i||i.type!=='file'||!i.files?.length)return;
    const src=Array.from(i.files);if(!src.some(f=>/^image\/(jpeg|png|webp)$/.test(f.type)&&f.size>350_000))return;
    try{const out:File[]=[];
      for(const f of src){if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size<=350_000){out.push(f);continue}
        const bmp=await createImageBitmap(f);const k=Math.min(1,1600/Math.max(bmp.width,bmp.height));const c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);
        const x=c.getContext('2d')!;x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
        const b:Blob|null=await new Promise(r=>c.toBlob(r,'image/jpeg',0.82));
        out.push(b&&b.size<f.size?new File([b],f.name.replace(/\.\w+$/,'')+'.jpg',{type:'image/jpeg'}):f)}
      const dt=new DataTransfer();out.forEach(f=>dt.items.add(f));i.files=dt.files}catch{}};
  document.addEventListener('change',on,true);return()=>document.removeEventListener('change',on,true)},[]);return null}
