'use client';

import React, { useEffect, useRef } from 'react';

import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

type Props = {
  children: React.ReactNode;
  delegate?: string;
};

export default function FancyboxWrapper({ children, delegate = '[data-fancybox]' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    NativeFancybox.bind(container, delegate, {
      Thumbs: { autoStart: false },
    } as any);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  }, [delegate]);

  return <div ref={containerRef}>{children}</div>;
}
