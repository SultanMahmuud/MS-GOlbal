import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import Script from "next/script";
import { Suspense } from "react";
import GTMAnalytics from "@/components/GTMAnalytics";

const Providers = dynamic(() => import("@/lib/providers"));
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Muslim School",
  
  icons: {
    icon: "/favicon.ico", // ✅ no ./public
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-arp="">
      <head>
        {/* Google Tag Manager Script (Head) */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `,
          }}
        />
      </head>

      <body
        data-new-gr-c-s-check-loaded="14.1244.0"
        data-gr-ext-installed=""
        className={`${hindSiliguri.variable}  antialiased `}
      >
        {/* Google Tag Manager (noscript) - Fallback for users with JavaScript disabled */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `,
          }}
        />
        <Suspense>
          <GTMAnalytics />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
