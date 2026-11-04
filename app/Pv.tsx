'use client';
import {useState} from 'react';
export default function Pv({name,label}:{name:string,label:string}){const [u,setU]=useState('');return <div><label className="block text-sm font-bold mb-1.5">{label}</label><input name={name} type="file" accept="image/jpeg,image/png,image/webp" className="inp" onChange={e=>{const f=e.target.files?.[0];setU(f?URL.createObjectURL(f):'')}}/>{u&&<img src={u} className="mt-2 rounded-xl aspect-video object-cover w-full" alt=""/>}</div>}
