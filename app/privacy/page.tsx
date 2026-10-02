import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowRight } from 'lucide-react';
import { JsonLd } from '../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতিমালা (Privacy Policy)',
  description:
    'ক্লিপকার্ট (ClipCart) প্ল্যাটফর্মের গোপনীয়তা নীতিমালা। জানুন আমরা কীভাবে ব্যবহারকারীর ব্যক্তিগত তথ্য, ভিডিও সাবমিশন ও বিকাশ পেমেন্ট ডেটা সুরক্ষিত রাখি।',
  alternates: {
    canonical: '/privacy',
    languages: {
      'bn-BD': '/privacy',
      'en-BD': '/en/privacy',
      'x-default': '/privacy',
    },
  },
  openGraph: {
    title: 'গোপনীয়তা নীতিমালা — ClipCart BD',
    description:
      'ব্যবহারকারীর তথ্য সুরক্ষা ও আর্থিক লেনদেনের স্বচ্ছতা নিশ্চিতকরণে ক্লিপকার্টের প্রতিশ্রুতি।',
    url: '/privacy',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'হোম', url: '/' },
          { name: 'গোপনীয়তা নীতিমালা', url: '/privacy' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b-2 border-zinc-950 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              লিগ্যাল ও সুরক্ষা
            </span>
            <span className="neo-sticker bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-950 dark:border-emerald-850 text-[10px]">
              সর্বশেষ আপডেট: অক্টোবর ২০২৬
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            গোপনীয়তা নীতিমালা
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            ক্লিপকার্ট (ClipCart) ব্যবহারকারীদের তথ্য সুরক্ষা ও আর্থিক লেনদেনের স্বচ্ছতাকে সর্বোচ্চ গুরুত্ব দেয়। এই নীতিমালাটি বর্ণনা করে আমরা কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ ও ব্যবহার করি।
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
          {/* Section 1 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">১. আমরা যেসব তথ্য সংগ্রহ করি</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>অ্যাকাউন্ট তথ্য:</strong> সাইনআপের সময় সংগৃহীত নাম, বৈধ ইমেইল অ্যাড্রেস, ব্যক্তিগত ফোন নম্বর এবং এনক্রিপ্ট করা পাসওয়ার্ড।
              </li>
              <li>
                <strong>ভিডিও সাবমিশন ডেটা:</strong> ক্লিপারদের দ্বারা সাবমিট করা পাবলিক ভিডিও লিঙ্ক (যেমন টিকটক, ইনস্টাগ্রাম রিলস, ইউটিউব শর্টস URL), ক্যাপশন ও ভিউ পরিসংখ্যান।
              </li>
              <li>
                <strong>পেমেন্ট সংক্রান্ত তথ্য:</strong> ক্যাশআউটের জন্য ক্লিপারের ব্যক্তিগত বিকাশ ওয়ালেট নম্বর এবং প্রদেয় TrxID রেফারেন্স।
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">২. তথ্যের ব্যবহার ও উদ্দেশ্য</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              আপনার তথ্য শুধুমাত্র নিম্নলিখিত প্রয়োজনীয় উদ্দেশ্যে ব্যবহৃত হয়:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>ব্যবহারকারীর অ্যাকাউন্ট তৈরি, ভেরিফিকেশন ও নিরাপত্তা বজায় রাখা।</li>
              <li>সাবমিট করা ক্লিপের নিয়মাবলী ও ডুপ্লিকেট URL স্ক্রিনিং সম্পাদন করা।</li>
              <li>ভিডিওর ভিউ গণনা ও পারফরম্যান্স অনুযায়ী CPM আয় হিসাব করা।</li>
              <li>বিকাশের মাধ্যমে সরাসরি এবং নির্ভুলভাবে উপার্জিত অর্থ বিতরণ করা।</li>
              <li>যেকোনো সন্দেহজনক কার্যকলাপ, বট ভিউ বা স্প্যাম প্রতিরোধ করা।</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৩. আর্থিক তথ্যের নিরাপত্তা</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ক্লিপকার্ট ব্যবহারকারীদের কোনো বিকাশ পিন (PIN), ওটিপি (OTP) বা স্পর্শকাতর ব্যাংকিং তথ্য কখনোই জিজ্ঞাসা করে না এবং সংরক্ষণ করে না। সকল উইথড্রয়াল প্রসেসিং সম্পূর্ণ ম্যানুয়াল প্রক্রিয়ায় এবং নিরাপদ চ্যানেল ব্যবহার করে সম্পন্ন হয়। প্রতিটি সফল পেমেন্টের পর ব্যবহারকারীর ড্যাশবোর্ডে অফিশিয়াল বিকাশ TrxID প্রদর্শন করা হয়।
            </p>
          </div>

          {/* Section 4 */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৪. তথ্য মুছে ফেলার ও আপডেটের অধিকার</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              প্রত্যেক ব্যবহারকারীর নিজস্ব প্রোফাইল ডেটা আপডেট করার এবং প্রয়োজনবোধে অ্যাকাউন্ট মুছে ফেলার অনুরোধ করার পূর্ণ অধিকার রয়েছে। আপনার ডেটা রিমুভালের জন্য আমাদের সাপোর্ট ডেস্কে অথবা অফিশিয়াল হোয়াটসঅ্যাপ হটলাইনে সরাসরি মেসেজ দিতে পারেন।
            </p>
          </div>
        </div>

        {/* Contact Desk */}
        <div className="neo-box-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-['Unbounded'] font-bold text-sm text-zinc-950 dark:text-white">
              গোপনীয়তা সংক্রান্ত কোনো প্রশ্ন আছে?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              আমাদের ঢাকা অপারেশন্স টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত।
            </p>
          </div>
          <Link href="/contact" className="neo-btn neo-btn-primary px-4 py-2 text-xs shrink-0 flex items-center gap-1.5">
            <span>যোগাযোগ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
