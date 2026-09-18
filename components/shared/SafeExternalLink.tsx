import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
  fallbackText?: string;
}

/**
 * Validates external URLs against XSS, javascript:, data: protocols and ensures rel="noopener noreferrer"
 */
export function isSafeUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function SafeExternalLink({
  href,
  children,
  showIcon = false,
  className = '',
  fallbackText = 'Invalid URL',
  ...props
}: SafeExternalLinkProps) {
  if (!isSafeUrl(href)) {
    return (
      <span className={`text-zinc-400 dark:text-zinc-600 line-through cursor-not-allowed ${className}`} title="Blocked unsafe or invalid link">
        {children || fallbackText}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children || href}
      {showIcon && <ExternalLink className="w-3.5 h-3.5 shrink-0 inline-block ml-1" />}
    </a>
  );
}
