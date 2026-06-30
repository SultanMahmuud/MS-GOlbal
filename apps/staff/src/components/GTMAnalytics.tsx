
'use client'; 

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';


declare global {
  interface Window {
    dataLayer: any[];
  }
}

const pageview = (path: string) => {
  window.dataLayer.push({
    event: 'pageview',
    page: path,
  });
};

export default function GTMAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const fullPath = pathname + '?' + searchParams.toString();
      pageview(fullPath);
    }
  }, [pathname, searchParams]); // pathname বা searchParams পরিবর্তন হলেই এটি আবার কাজ করবে

  return null; // এই কম্পোনেন্ট কোনো কিছু দেখাবে না
}