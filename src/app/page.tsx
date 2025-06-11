// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // This initial redirect sends the user to a protected route.
  // The (app) layout or AuthProvider will then handle the auth check
  // and redirect to /auth/sign-in if necessary.
  redirect('/reports/call-detail');
}
