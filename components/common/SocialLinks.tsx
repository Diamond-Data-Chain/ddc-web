"use client";

import React from "react";

type Item = { key: string; label: string; href: string; svg: React.ReactNode };

// TODO: replace href values with real links later (LinkedIn/Discord/Telegram/YouTube/GitHub/TikTok)
const ITEMS: Item[] = [
 {
 key: "linkedin",
 label: "LinkedIn",
 href: "#",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path fill="currentColor" d="M6.94 6.5A2.04 2.04 0 1 1 6.9 2.42a2.04 2.04 0 0 1 .04 4.08ZM3.9 21.5h6.1V8.2H3.9V21.5Zm8.2-13.3h5.8v1.82h.08c.8-1.5 2.76-3.08 5.68-3.08 6.08 0 7.2 4 7.2 9.2v5.06h-6.1v-4.48c0-2.14-.04-4.9-2.98-4.9-2.98 0-3.44 2.32-3.44 4.74v4.64H12.1V8.2Z" />
 </svg>
 ),
 },
 {
 key: "discord",
 label: "Discord",
 href: "#",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path
 fill="currentColor"
 d="M19.5 6.3a15.6 15.6 0 0 0-3.9-1.2l-.2.4c1.4.4 2 .9 2 .9-2.4-1.1-4.7-1.3-6.7-1.1-1.1.1-2.2.4-3.3.8l.7-.3s.6-.5 2.1-.9l-.2-.4a15.5 15.5 0 0 0-3.9 1.2C2.4 10 2 13.8 2 13.8s.5 3.9 1.8 5.5c0 0 1.6 1.5 5.9 1.6 0 0 .7-.9 1.2-1.7-2.3-.7-3.1-2.1-3.1-2.1s.2.1.6.4c0 0 0 0 .1 0 .1 0 .2.1.3.2 0 0 .1.1.2.1.6.3 1.2.5 1.8.7 1.1.3 2.4.5 3.8.5 1.4 0 2.7-.2 3.8-.5.6-.2 1.2-.4 1.8-.7l.2-.1.3-.2s.1 0 .1 0c.4-.2.6-.4.6-.4s-.8 1.4-3.1 2.1c.5.8 1.2 1.7 1.2 1.7 4.3-.1 5.9-1.6 5.9-1.6 1.3-1.6 1.8-5.5 1.8-5.5s-.4-3.8-2.4-7.5ZM9.2 14.8c-.7 0-1.2-.6-1.2-1.4s.5-1.4 1.2-1.4c.7 0 1.2.6 1.2 1.4s-.5 1.4-1.2 1.4Zm5.6 0c-.7 0-1.2-.6-1.2-1.4s.5-1.4 1.2-1.4c.7 0 1.2.6 1.2 1.4s-.5 1.4-1.2 1.4Z"
 />
 </svg>
 ),
 },
 {
 key: "telegram",
 label: "Telegram",
 href: "#",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path
 fill="currentColor"
 d="M21.6 4.3 2.9 11.6c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.2-.3 4.6c.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.2-.4-1.7-1.4-1.3Z"
 />
 </svg>
 ),
 },
 {
 key: "youtube",
 label: "YouTube",
 href: "#",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path
 fill="currentColor"
 d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.4 31.4 0 0 0 2 12s.1 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10.2 14.8V9.2L15 12l-4.8 2.8Z"
 />
 </svg>
 ),
 },
 {
 key: "github",
 label: "GitHub",
 href: "https://github.com/Diamond-Data-Chain",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path
 fill="currentColor"
 d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a4 4 0 0 1 1-2.8c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.5 9.5 0 0 1 5.2 0c1.9-1.4 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.8c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2Z"
 />
 </svg>
 ),
 },
 {
 key: "tiktok",
 label: "TikTok",
 href: "#",
 svg: (
 <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
 <path
 fill="currentColor"
 d="M16.8 2h-3.1v13c0 1.8-1.4 3.2-3.2 3.2s-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2c.3 0 .6 0 .9.1V9.8c-.3 0-.6-.1-.9-.1-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3V8.5c1.2.9 2.7 1.4 4.3 1.4V6.8c-2 0-3.7-1.5-4-3.5Z"
 />
 </svg>
 ),
 },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
 return (
 <div className={"flex items-center gap-3 " + className}>
 {ITEMS.map(({ key, label, href, svg }) => (
 <a
 key={key}
 href={href}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={label}
 title={label}
 className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/40 hover:bg-slate-800/40 transition"
 >
 <span className="text-slate-200">{svg}</span>
 </a>
 ))}
 </div>
 );
}
