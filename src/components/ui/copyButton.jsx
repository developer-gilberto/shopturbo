'use client';

import { useState } from 'react';
import { RxCopy } from 'react-icons/rx';

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      const ref = setTimeout(() => setCopied(false), 500);
      return () => {
        clearTimeout(ref);
      };
    } catch (err) {
      alert('Não foi possível copiar!');
    }
  }

  return (
    <>
      {copied && (
        <div className="bg-green-700 p-1 text-sm text-white font-bold absolute top-8 left-1/2 z-[100]">
          Copiado!
        </div>
      )}

      <RxCopy
        className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer"
        onClick={handleCopy}
      />
    </>
  );
}
