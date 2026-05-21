'use client';

import React from 'react';

type Props = { name: string; children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class SectionBoundary extends React.Component<Props, State> {
 state: State = { hasError: false };

 static getDerivedStateFromError(err: any): State {
 return { hasError: true, message: err?.message ? String(err.message) : String(err) };
 }

 componentDidCatch(err: any) {
 console.error(`[SectionBoundary] ${this.props.name} crashed:`, err);
 }

 render() {
 if (this.state.hasError) {
 return (
 <section className="py-10">
 <div className="mx-auto max-w-5xl px-6">
 <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-slate-200">
 <div className="text-sm uppercase tracking-wider text-slate-400">
 {this.props.name} failed to load
 </div>
 <div className="mt-2 text-sm text-slate-300">
 {this.state.message || 'Unknown error'}
 </div>
 <div className="mt-3 text-sm text-slate-400">
 Please refresh the page or contact support if the issue persists.
 </div>
 </div>
 </div>
 </section>
 );
 }
 return this.props.children;
 }
}
