'use client';

export default function GlobalError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 return (
 <html>
 <body style={{ margin: 0 }}>
 <main style={{ padding: 24, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
 <h1 style={{ fontSize: 18, marginBottom: 12 }}>Global error</h1>
 <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#eee', padding: 12, borderRadius: 12 }}>
 {String(error?.message || error)}
 {error?.stack ? `\n\n${error.stack}` : ''}
 {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
 </pre>
 <button
 onClick={() => reset()}
 style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid #ccc' }}
 >
 Retry
 </button>
 </main>
 </body>
 </html>
 );
}
