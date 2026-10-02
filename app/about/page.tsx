import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaySquare, ShieldCheck, Banknote, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { JsonLd } from '../../components/seo/JsonLd';
import { getBreadcrumbSchema } from '../../lib/seo/schema';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে — বাংলাদেশি কনটেন্ট ডিস্ট্রিবিউশন হাউস',
  description:
    'ক্লিপকার্ট (ClipCart) বাংলাদেশের প্রথম শর্ট-ফর্ম ভিডিও ক্লিপিং ও ডিস্ট্রিবিউশন মার্কেটপ্লেস। আমরা পডকাস্টার ও ব্র্যান্ডের সাথে দেশীয় ভিডিও এডিটরদের সংযুক্ত করে ভিউ প্রতি নিশ্চিত আয় ও অর্গানিক রিচ নিশ্চিত করি।',
  alternates: {
    canonical: '/about',
    languages: {
      'bn-BD': '/about',
      'en-BD': '/en/about',
      'x-default': '/about',
    },
  },
  openGraph: {
    title: 'আমাদের সম্পর্কে — ClipCart BD',
    description:
      'বাংলাদেশের ক্রিয়েটর ইকোনমির জন্য পারফরম্যান্স-ভিত্তিক কনটেন্ট ডিস্ট্রিবিউশন। জানুন আমাদের মিশন ও পরিচালনা পদ্ধতি।',
    url: '/about',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: 'হোম', url: '/' },
          { name: 'আমাদের সম্পর্কে', url: '/about' },
        ])}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              মিশন ও পরিচিতি
            </span>
            <span className="neo-sticker bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-950 dark:border-rose-850 text-[10px]">
              ঢাকা, বাংলাদেশ
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-['Unbounded'] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
            লং-ফর্ম কনটেন্টকে <span className="text-rose-600">ভাইরাল ডিস্ট্রিবিউশনে</span> রূপান্তর
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-3xl">
            ক্লিপকার্ট (ClipCart) হলো বাংলাদেশের প্রথম পারফরম্যান্স-ভিত্তিক কনটেন্ট ডিস্ট্রিবিউশন ও ক্লিপিং মার্কেটপ্লেস। আমরা দেশের শীর্ষ পডকাস্টার, স্টার্টআপ প্রতিষ্ঠাতা ও কনজিউমার ব্র্যান্ডগুলোর সাথে শত শত তরুণ ও দক্ষ ভিডিও এডিটরকে সরাসরি সংযুক্ত করি।
          </p>
        </div>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">
              আমরা যে সমস্যা সমাধান করছি
            </span>
            <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              কনটেন্ট তৈরি হয় প্রচুর, কিন্তু পৌঁছায় না মানুষের কাছে
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              বাংলাদেশে প্রতিটি পডকাস্ট, ওয়েবিনার ও ইন্টারভিউ তৈরিতে প্রচুর মেধা ও অর্থ ব্যয় হয়। অথচ সেই ঘণ্টার পর ঘণ্টা ভিডিও শুধুমাত্র একটি ইউটিউব লিংকে বন্দী থাকে। অন্যদিকে হাজারো তরুণ ভিডিও এডিটর আন্তর্জাতিক জটিল পেমেন্ট বাধা ছাড়াই নিজের দক্ষতা দিয়ে আয়ের উপায় খুঁজছেন।
            </p>
          </div>

          <div className="neo-box p-6 space-y-3 bg-white dark:bg-[#14151a]">
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
              ক্লিপকার্টের সমাধান
            </span>
            <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
              বিকেন্দ্রীভূত ক্লিপিং নেটওয়ার্ক ও নিশ্চিত ভিউ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              ব্র্যান্ডগুলো কেবল মূল ভিডিও ফুটেজ ও বাজেট প্রদান করে। আমাদের রেজিস্টার্ড ক্লিপাররা সেই ফুটেজ থেকে সেরা মোমেন্টগুলো কেটে আকর্ষণীয় শর্টস, রিলস ও টিকটক ভিডিও বানিয়ে সোশ্যাল মিডিয়ায় ছড়িয়ে দেয়। ব্র্যান্ড পায় নিশ্চিত অর্গানিক ভিউ, আর এডিটররা পান প্রতি ১,০০০ ভিউয়ে নিশ্চিত ক্যাশআউট।
            </p>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-6">
          <div className="border-b-2 border-zinc-950 dark:border-zinc-800 pb-3">
            <h2 className="text-2xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
              আমাদের ৩টি মূল মূলনীতি
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-rose-600">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                আর্থিক অন্তর্ভুক্তি ও ০% ফি
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                আন্তর্জাতিক গেটওয়ের ঝামেলা নেই। সর্বনিম্ন ৳৫০ উপার্জনেই ক্লিপাররা সরাসরি তাদের ব্যক্তিগত বিকাশ নম্বরে ক্যাশআউট করতে পারেন। এডিটরদের থেকে প্ল্যাটফর্ম কোনো কমিশন বা ফি কাটে না।
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                মানুষের দ্বারা ভিউ অডিট
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                কোনো বট বা ফেক ভিউ গ্রহণযোগ্য নয়। প্রতিটি সাবমিশন প্রথমে আমাদের স্বয়ংক্রিয় এআই ফিল্টারে লিঙ্ক ও ডুপ্লিকেট চেক হয়, এবং ফাইনাল পেমেন্টের পূর্বে অভিজ্ঞ মডারেটরের দ্বারা ভিউ যাচাই করা হয়।
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="neo-box p-5 space-y-3 bg-white dark:bg-[#14151a]">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
                ব্র্যান্ড সেফটি ও ফেয়ার প্লে
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                ব্র্যান্ডের সুনাম রক্ষায় আমাদের রয়েছে স্পষ্ট গাইডলাইন। ভুল তথ্য, আপত্তিকর সম্পাদনা বা অপ্রাসঙ্গিক ক্লিকবেইট নিষিদ্ধ। এডিটররা সৃজনশীল স্বাধীনতা পান, ব্র্যান্ড পায় নিরাপদ অর্গানিক গ্রোথ।
              </p>
            </div>
          </div>
        </div>

        {/* How We Operate / Model */}
        <div className="neo-box-lg p-6 sm:p-8 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-['Unbounded'] font-bold text-zinc-950 dark:text-white">
            ক্লিপকার্ট কিভাবে পরিচালিত হয়?
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
            <p>
              ক্লিপকার্ট পরিচালিত হয় ঢাকা অপারেশন্স টিম দ্বারা। প্রতিটি ক্যাম্পেইনের জন্য আমরা ক্লায়েন্ট ও ক্রিয়েটরদের চাহিদা অনুযায়ী কাস্টম ব্রিফ তৈরি করি, গুগল ড্রাইভে হাই-রেজ্যুলুশন সোর্স ফুটেজ হোস্ট করি এবং সাবমিশন ট্র্যাকিং নিশ্চিত করি।
            </p>
            <p>
              প্ল্যাটফর্মের স্বচ্ছতা বজায় রাখতে আমাদের সমস্ত পেমেন্ট রেকর্ড একটি অপরিবর্তনযোগ্য লেজারে সংরক্ষিত থাকে। প্রতিটি ক্যাশআউটে অফিসিয়াল বিকাশ TrxID যুক্ত থাকে যা যে কেউ অডিট করতে পারেন।
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="neo-box-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-[#14151a]">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white">
              আমাদের সাথে কাজ করতে প্রস্তুত?
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              ভিডিও এডিটর হিসেবে রেজিস্ট্রেশন করুন অথবা আপনার ব্র্যান্ডের জন্য ক্যাম্পেইন লঞ্চ করুন।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/register" className="neo-btn neo-btn-primary px-5 py-2.5 text-xs">
              ক্লিপার হিসেবে জয়েন করুন
            </Link>
            <a
              href="https://wa.me/8801337142248?text=Hello%20ClipCart%2C%20I%20want%20to%20learn%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-btn-whatsapp px-5 py-2.5 text-xs flex items-center gap-1.5"
            >
              <span>হোয়াটসঅ্যাপ ডেস্ক</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
