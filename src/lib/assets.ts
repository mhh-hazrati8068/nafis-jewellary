/**
 * Resolves static asset paths taking into account Next.js basePath and GitHub Pages subpaths.
 */
export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // 1. Check environment variable
  const envBase = process.env.NEXT_PUBLIC_BASE_PATH;
  if (envBase) {
    return `${envBase.replace(/\/$/, '')}${cleanPath}`;
  }

  // 2. Client-side GitHub Pages detection (e.g. https://username.github.io/repo-name/...)
  if (typeof window !== 'undefined') {
    const { pathname, hostname } = window.location;
    if (hostname.endsWith('github.io')) {
      const firstSegment = pathname.split('/').filter(Boolean)[0];
      if (firstSegment && !firstSegment.includes('.')) {
        return `/${firstSegment}${cleanPath}`;
      }
    }
  }

  return cleanPath;
}
