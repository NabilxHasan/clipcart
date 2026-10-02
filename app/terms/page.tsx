import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Scale, ShieldAlert, ArrowRight } from 'lucide-react';
import { JsonLd } from '../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'ব্যবহারের নিয়ম ও শর্তাবলী (Terms of Service)',
  description:
    'ক্লিপকার্ট (ClipCart) ব্যবহারের নিয়মাবলী ও প্ল্যাটফর্মের সাধারণ শর্তাবলী। ক্লিপারদের কনটেন্ট নীতিমালা, ৳৫০ বিকাশ উইথড্রয়াল রুলস, এবং ক্লায়েন্ট ডিস্ট্রিবিউশন শর্তাদি।',
  alternates: {
    canonical: '/terms',
    languages: {
      'bn-BD': '/terms',
      'en-BD': '/en/terms',
      'x-default': '/terms',
    },
  },
  openGraph: {
    title: 'ব্যবহারের নিয়ম ও শর্তাবলী — ClipCart BD',
    description:
      'ক্লিপকার্ট ব্যবহারের শর্তাবলী ও স্বচ্ছ পারফরম্যান্স গাইডলাইন।',
    url: '/terms',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'হোম', url: '/' },
          { name: 'ব্যবহারের নিয়ম ও শর্তাবলী', url: '/terms' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b-2 border-zinc-950 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              ব্যবহারের নিয়মাবলী
            </span>
            <span className="neo-sticker bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-950 dark:border-amber-850 text-[10px]">
              কার্যকর: অক্টোবর ২০২৬
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            নিয়ম ও শর্তাবলী
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            ক্লিপকার্ট (ClipCart) প্ল্যাটফর্ম ব্যবহার, ভিডিও সাবমিশন, এবং ক্যাম্পেইন পরিচালনার সাধারণ শর্তাবলী। আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত নিয়মসমূহ মেনে চলতে সম্মত হচ্ছেন।
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
          {/* Section 1: Overview */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">১. সাধারণ শর্তাবলী ও প্ল্যাটফর্মের ভূমিকা</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ক্লিপকার্ট একটি পারফরম্যান্স ভিত্তিক শর্ট-ফর্ম কনটেন্ট ডিস্ট্রিবিউশন প্ল্যাটফর্ম। আমরা কনটেন্ট নির্মাতা ও ব্র্যান্ডগুলোর সাথে স্বাধীন ভিডিও এডিটরদের (ক্লিপার) সংযুক্ত করি। ক্লিপাররা স্বাধীন কন্ট্রাক্টর হিসেবে কাজ করেন এবং প্রতি ১,০০০ অনুমোদিত ও নিরীক্ষিত অর্গানিক ভিউয়ের ভিত্তিতে CPM উপার্জন করেন।
            </p>
          </div>

          {/* Section 2: Clipper Obligations & Anti-Fraud */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">২. ক্লিপারদের দায়িত্ব ও ভিউ সততা</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>অরিজিনাল এডিটিং:</strong> ক্লিপারদের ক্যাম্পেইনে দেওয়া মূল ফুটেজ থেকে নিজস্ব সম্পাদনায় হাই-রিটেনশন হুক, কাইনেটিক ক্যাপশন ও সাউন্ড ডিজাইন তৈরি করতে হবে।
              </li>
              <li>
                <strong>বট ও ফেক ভিউ নিষিদ্ধ:</strong> কোনো ধরনের ভিউ কেনা, অটোমেটেড বট ট্রাফিক, ক্লিক ফার্ম বা কৃত্রিমভাবে ভিউ বৃদ্ধি করা সম্পূর্ণ নিষিদ্ধ। কোনো সাবমিশনে ফেক অ্যাক্টিভিটি ধরা পড়লে সেই সাবমিশন বাতিল হবে এবং সংশ্লিষ্ট ক্লিপারের অ্যাকাউন্ট স্থায়ীভাবে বরখাস্ত করা হতে পারে।
              </li>
              <li>
                <strong>লাইভ লিঙ্ক জমা:</strong> ভিডিও পাবলিশের পর কেবল সক্রিয় এবং পাবলিকলি অ্যাক্সেসযোগ্য TikTok, Instagram Reels, বা YouTube Shorts লিঙ্ক জমা দিতে হবে।
              </li>
            </ul>
          </div>

          {/* Section 3: ৳50 Signup Verification Fee */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৩. এককালীন ৳৫০ ভেরিফিকেশন ফি</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ক্লিপকার্ট প্ল্যাটফর্মে স্প্যাম প্রতিরোধ করতে এবং ব্র্যান্ড ক্যাম্পেইনের বাজেট সুরক্ষিত রাখতে ক্লিপার রেজিস্ট্রেশনের সময় এককালীন ৳৫০ বিকাশ ভেরিফিকেশন ফি প্রযোজ্য। এটি কোনো হিডেন চার্জ নয়, বরং সত্যিকারের দক্ষ এডিটরদের প্ল্যাটফর্মে সুযোগ করে দেওয়ার একটি ফিল্টারিং ব্যবস্থা। ক্লিপারদের উপার্জনের ওপর ভবিষ্যতে ০% প্ল্যাটফর্ম ফি প্রযোজ্য (কোনো টাকা কাটা হয় না)।
            </p>
          </div>

          {/* Section 4: Brand Terms */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৪. ব্র্যান্ড ক্লায়েন্টদের শর্তাবলী</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>মাইক্রো-ক্যাম্পেইন ও বাজেট:</strong> ক্লায়েন্টরা ন্যূনতম ৳১,০০০ বাজেট এবং ৩ দিনের সময়সীমা দিয়ে ক্যাম্পেইন শুরু করতে পারেন। ক্যাম্পেইন বাজেটের ওপর অতিরিক্ত ১০% প্ল্যাটফর্ম কিউরেশন ও অডিট ফি প্রযোজ্য।
              </li>
              <li>
                <strong>ক্যাম্পেইন সমাপ্তি ও মেয়াদ:</strong> ক্যাম্পেইন নির্ধারিত দিনে বা বাজেট শেষ হওয়া পর্যন্ত স্বয়ংক্রিয়ভাবে পরিচালিত হয়। ক্লিপারদের দ্বারা অর্জিত ভিউ অডিট শেষে স্বয়ংক্রিয়ভাবে বাজেট থেকে সমন্বয় করা হয়।
              </li>
            </ul>
          </div>

          {/* Section 5: Payouts & Cashouts */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৫. পেমেন্ট ও ক্যাশআউট নীতি</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              ক্লিপাররা তাদের ওয়ালেটে নূন্যতম ৳৫০ জমা হলেই সরাসরি বিকাশ অ্যাকাউন্টে ক্যাশআউট রিকোয়েস্ট করতে পারেন। আমাদের অ্যাডমিন টিম ম্যানুয়ালি ভিউ অডিট সম্পন্ন করে ২৪ থেকে ৭২ ঘণ্টার মধ্যে প্রদেয় অর্থ পাঠিয়ে দেয় এবং ট্রানজ্যাকশন আইডি (TrxID) সিস্টেমে আপডেট করে।
            </p>
          </div>

          {/* Section 6: Prohibited Content */}
          <div className="neo-box p-6 space-y-3 bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৬. নিষিদ্ধ কনটেন্ট ও বাতিলকরণ</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              নিম্নলিখিত কনটেন্ট যুক্ত কোনো ক্লিপ সাবমিট করা সম্পূর্ণ নিষিদ্ধ এবং তাৎক্ষণিক বাতিলযোগ্য:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>অশ্লীল, যৌন উত্তেজক বা আপত্তিকর দৃশ্য বা ভাষা।</li>
              <li>ধর্মীয় অনুভূতিতে আঘাত, জাতিগত বিদ্বেষ বা রাজনৈতিক উস্কানিমূলক বিকৃতি।</li>
              <li>ক্যাম্পেইন স্পেসিফিকেশনের সাথে অসামঞ্জস্যপূর্ণ ক্লিকবেইট বা বিভ্রান্তিকর ক্যাপশন।</li>
            </ul>
          </div>

          {/* Section 7: Jurisdiction */}
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm">
              <Scale className="w-4 h-4" />
              <h2 className="font-['Unbounded'] text-zinc-950 dark:text-white">৭. আইনগত এখতিয়ার</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              এই নীতিমালাটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রচলিত আইন অনুযায়ী পরিচালিত হবে। প্ল্যাটফর্ম সংক্রান্ত যেকোনো বিরোধ বা জটিলতা সমাধানের জন্য ঢাকার উপযুক্ত আদালতের এখতিয়ার প্রযোজ্য হবে।
            </p>
          </div>
        </div>

        {/* Contact Desk */}
        <div className="neo-box-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-['Unbounded'] font-bold text-sm text-zinc-950 dark:text-white">
              শর্তাবলী সংক্রান্ত যেকোনো সহায়তায়
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              আমাদের অফিসিয়াল ডেস্কে যোগাযোগ করুন।
            </p>
          </div>
          <Link href="/contact" className="neo-btn neo-btn-primary px-4 py-2 text-xs shrink-0 flex items-center gap-1.5">
            <span>যোগাযোগ ডেস্ক</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
