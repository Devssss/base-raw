import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.APP_URL || 'https://example.com';
  return {
    title: 'Base Swap Portal',
    description: 'A seamless token swap portal built for the Base ecosystem.',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${appUrl}/og-image.png`,
        button: {
          title: 'Launch Swap',
          action: {
            type: 'launch_miniapp',
            name: 'Base Swap Portal',
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-slate-950 font-sans antialiased text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
