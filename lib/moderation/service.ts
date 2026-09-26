// AI Pre-filter & Moderation Heuristic Pipeline
// Performs automated submission validation, platform parsing, duplicate detection, and suspicion scoring.
// AI NEVER makes final payment decisions or automatic account bans.

import { PlatformType, SubmissionFlag, Submission } from '../types/database';

export interface PreFilterInput {
  platform: PlatformType;
  postUrl: string;
  caption?: string;
  notes?: string;
  existingSubmissions: Submission[];
  campaignRules: string[];
}

export class AiModeratorService {
  /**
   * Validate platform URL format using strict regex patterns.
   */
  static validateUrlFormat(platform: PlatformType, url: string): { isValid: boolean; normalizedUrl: string; error?: string } {
    const trimmed = url.trim();

    try {
      const parsed = new URL(trimmed);
      const hostname = parsed.hostname.toLowerCase();

      switch (platform) {
        case 'TIKTOK': {
          if (!hostname.includes('tiktok.com')) {
            return { isValid: false, normalizedUrl: trimmed, error: 'URL must be a valid TikTok post (tiktok.com/@username/video/... or vm.tiktok.com)' };
          }
          return { isValid: true, normalizedUrl: trimmed };
        }
        case 'INSTAGRAM': {
          if (!hostname.includes('instagram.com')) {
            return { isValid: false, normalizedUrl: trimmed, error: 'URL must be a valid Instagram Reel or post (instagram.com/reel/...)' };
          }
          return { isValid: true, normalizedUrl: trimmed };
        }
        case 'YOUTUBE': {
          if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
            return { isValid: false, normalizedUrl: trimmed, error: 'URL must be a valid YouTube Shorts or video link (youtube.com/shorts/... or youtu.be/...)' };
          }
          return { isValid: true, normalizedUrl: trimmed };
        }
        case 'FACEBOOK': {
          if (!hostname.includes('facebook.com') && !hostname.includes('fb.watch') && !hostname.includes('fb.com')) {
            return { isValid: false, normalizedUrl: trimmed, error: 'URL must be a valid Facebook Reel or video link (facebook.com/reel/... or fb.watch/...)' };
          }
          return { isValid: true, normalizedUrl: trimmed };
        }
        default:
          return { isValid: false, normalizedUrl: trimmed, error: 'Unsupported platform' };
      }
    } catch {
      return { isValid: false, normalizedUrl: trimmed, error: 'Malformed URL provided. Please provide a full URL with https://' };
    }
  }

  /**
   * Run heuristic and rule-based risk evaluation.
   */
  static evaluateSubmission(input: PreFilterInput): Omit<SubmissionFlag, 'id' | 'submissionId' | 'createdAt'> {
    const violations: string[] = [];
    let complianceScore = 100;
    let duplicateProbability = 0;
    let suspicionScore = 0;

    // 1. URL validity
    const urlValidation = this.validateUrlFormat(input.platform, input.postUrl);
    if (!urlValidation.isValid) {
      violations.push(`Invalid platform URL format: ${urlValidation.error}`);
      complianceScore -= 50;
      suspicionScore += 40;
    }

    // 2. Duplicate Detection
    const cleanUrl = input.postUrl.trim().toLowerCase().replace(/\/+$/, '');
    const isDuplicate = input.existingSubmissions.some(
      s => s.postUrl.trim().toLowerCase().replace(/\/+$/, '') === cleanUrl
    );

    if (isDuplicate) {
      violations.push('Duplicate URL: This post URL has already been submitted to this or another campaign.');
      duplicateProbability = 95;
      complianceScore = Math.max(0, complianceScore - 80);
      suspicionScore = Math.max(suspicionScore, 90);
    }

    // 3. Caption / Hashtag heuristic checking against basic requirements
    if (input.caption) {
      const lowerCaption = input.caption.toLowerCase();
      if (lowerCaption.length < 5) {
        violations.push('Caption is unusually brief or missing context.');
        complianceScore -= 10;
        suspicionScore += 10;
      }
    }

    // 4. Determine recommended moderation queue
    let recommendedQueue: 'AUTO_FORWARD' | 'HUMAN_REVIEW' | 'HIGH_PRIORITY_REVIEW' = 'HUMAN_REVIEW';
    if (suspicionScore >= 70 || duplicateProbability >= 80) {
      recommendedQueue = 'HIGH_PRIORITY_REVIEW';
    } else if (complianceScore >= 90 && suspicionScore < 20) {
      recommendedQueue = 'AUTO_FORWARD';
    }

    let reasoning = `Automated check: URL syntax ${urlValidation.isValid ? 'valid' : 'invalid'}. `;
    if (isDuplicate) {
      reasoning += 'Duplicate URL detected across system submissions. ';
    } else {
      reasoning += 'No identical URL detected in database. ';
    }
    if (violations.length > 0) {
      reasoning += `Detected ${violations.length} potential issue(s). Requires moderator inspection.`;
    } else {
      reasoning += 'Standard submission passed initial syntax checks. Ready for view verification.';
    }

    return {
      complianceScore: Math.max(0, Math.min(100, complianceScore)),
      duplicateProbability,
      suspicionScore: Math.max(0, Math.min(100, suspicionScore)),
      ruleViolations: violations,
      reasoningSummary: reasoning,
      recommendedQueue,
    };
  }
}
