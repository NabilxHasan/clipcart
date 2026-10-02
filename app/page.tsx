import React from 'react';
import type { Metadata } from 'next';
import { ClipBDRepository } from '../lib/db/repository';
import { HomeClient } from '../components/home/HomeClient';

export const metadata: Metadata = {
  title: 'ClipCart — বাংলাদেশি কনটেন্ট ডিস্ট্রিবিউশন প্ল্যাটফর্ম',
  description:
    'সেরা পডকাস্ট ও ব্র্যান্ড কনটেন্ট ছড়িয়ে দিন টিকটক, রিলস ও শর্টসে। ৳১,০০০ থেকে ক্যাম্পেইন, ক্লিপারদের জন্য ০% ফিতে সরাসরি বিকাশে আয়।',
  alternates: {
    canonical: '/',
    languages: {
      'bn-BD': '/',
      'en-BD': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'ClipCart — বাংলাদেশি কনটেন্ট ডিস্ট্রিবিউশন প্ল্যাটফর্ম',
    description:
      'সেরা পডকাস্ট ও ব্র্যান্ড কনটেন্ট ছড়িয়ে দিন টিকটক, রিলস ও শর্টসে। ৳১,০০০ থেকে ক্যাম্পেইন, ক্লিপারদের জন্য ০% ফিতে সরাসরি বিকাশে আয়।',
    url: '/',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default async function HomePage() {
  const activeCampaigns = await ClipBDRepository.getActiveCampaigns();

  return <HomeClient activeCampaigns={activeCampaigns} />;
}
