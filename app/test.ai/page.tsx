'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  async function testAI() {
    setLoading(true);
    setResult('');

    const res = await fetch('/api/ai/content-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isletme_adi: 'Mogaf Bakırköy',
        sektor: 'Restoran',
        sehir: 'İstanbul',
        hedef: 'Daha fazla müşteri',
      }),
    });

    const data = await res.json();

    if (data.result) {
      setResult(data.result);
    } else {
      setResult(data.error || 'Bir hata oluştu.');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Claude AI Test</h1>

      <button
        onClick={testAI}
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-700 px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {loading ? 'Üretiliyor...' : 'İçerik Planı Üret'}
      </button>

      {result && (
        <pre className="mt-8 whitespace-pre-wrap bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm leading-6">
          {result}
        </pre>
      )}
    </main>
  );
}