import React from 'react';
import { LanguageProvider } from '../../lib/i18n/context';

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider defaultLang="en">
      {children}
    </LanguageProvider>
  );
}
