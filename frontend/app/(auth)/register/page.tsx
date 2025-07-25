'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthFlow from '@/components/auth/AuthFlow';

export default function RegisterPage() {
  return <AuthFlow initialView="register" />;
}
