// Content filtering utility for detecting illegal characters, emojis, and inappropriate content

// List of curse words and inappropriate terms
const CURSE_WORDS = [
  "fuck",
  "shit",
  "damn",
  "bitch",
  "asshole",
  "bastard",
  "crap",
  "piss",
  "whore",
  "slut",
  "retard",
  "faggot",
  "nigger",
  "cunt",
  "cock",
  "pussy",
  "tits",
  "ass",
  "sex",
  "porn",
  "nude",
  "naked",
  "kill",
  "hell",
  "suicide",
  "murder",
  "rape",
  "drug",
  "cocaine",
  "heroin",
  "marijuana",
  "weed",
  "alcohol",
  "beer",
  "wine",
  "vodka",
  "whiskey",
  "drunk",
  "high",
  "stupid",
  "idiot",
  "moron",
  "dumb",
  "loser",
  "hate",
  "racist",
  "nazi",
  "chudi",
  "chudai",
  "chod",
  "chud",
];

// Illegal characters that should not be allowed
const ILLEGAL_CHARACTERS = [
  "\u0000",
  "\u0001",
  "\u0002",
  "\u0003",
  "\u0004",
  "\u0005",
  "\u0006",
  "\u0007",
  "\u0008",
  "\u000B",
  "\u000C",
  "\u000E",
  "\u000F",
  "\u0010",
  "\u0011",
  "\u0012",
  "\u0013",
  "\u0014",
  "\u0015",
  "\u0016",
  "\u0017",
  "\u0018",
  "\u0019",
  "\u001A",
  "\u001B",
  "\u001C",
  "\u001D",
  "\u001E",
  "\u001F",
  "\u007F",
];

/**
 * Checks if a text contains a whole word (not as part of another word)
 */
function includesWholeWord(text: string, word: string): boolean {
  const regex = new RegExp(
    `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "i"
  );
  return regex.test(text);
}

export interface ContentFilterResult {
  isValid: boolean;
  reason?: string;
  detectedIssues: string[];
}

/**
 * Detects if text contains emojis
 */
export function containsEmojis(text: string): boolean {
  // Comprehensive emoji regex that covers all Unicode emoji ranges
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F251}]|[\u{1F910}-\u{1F96B}]|[\u{1F980}-\u{1F997}]|[\u{1F9C0}-\u{1F9E6}]|[\u{1FA70}-\u{1FAFF}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{23CF}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu;
  return emojiRegex.test(text);
}

/**
 * Detects if text contains illegal characters
 */
export function containsIllegalCharacters(text: string): boolean {
  return ILLEGAL_CHARACTERS.some(char => text.includes(char));
}

/**
 * Detects if text contains curse words or inappropriate content
 */
export function containsCurseWords(text: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

  return CURSE_WORDS.some(curseWord => {
    return includesWholeWord(normalizedText, curseWord);
  });
}

/**
 * Detects if text contains excessive special characters (potential spam)
 */
export function containsExcessiveSpecialChars(text: string): boolean {
  const specialCharCount = (
    text.match(/[!@#$%^&*()_+=\-[\]{}|;':",./<>?]/g) || []
  ).length;
  const totalLength = text.length;

  // If more than 30% of the text is special characters, consider it excessive
  return totalLength > 0 && specialCharCount / totalLength > 0.3;
}

/**
 * Detects if text contains suspicious patterns (like repeated characters)
 */
export function containsSuspiciousPatterns(text: string): boolean {
  // Check for excessive repeated characters (like "aaaaaaa" or "!!!!!!")
  const repeatedCharPattern = /(.)\1{5,}/;

  // Check for excessive repeated words
  const words = text.toLowerCase().split(/\s+/);
  const wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasRepeatedWords = Object.values(wordCounts).some(count => count > 3);

  return repeatedCharPattern.test(text) || hasRepeatedWords;
}

/**
 * Main content filter function that checks all rules
 */
export function validateContent(text: string): ContentFilterResult {
  const issues: string[] = [];

  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      reason: "Message cannot be empty",
      detectedIssues: ["empty_message"],
    };
  }

  if (containsEmojis(text)) {
    issues.push("emojis");
  }

  if (containsIllegalCharacters(text)) {
    issues.push("illegal_characters");
  }

  if (containsCurseWords(text)) {
    issues.push("inappropriate_language");
  }

  if (containsExcessiveSpecialChars(text)) {
    issues.push("excessive_special_characters");
  }

  if (containsSuspiciousPatterns(text)) {
    issues.push("suspicious_patterns");
  }

  if (issues.length > 0) {
    let reason = "Your message contains content that is not allowed: ";
    const reasonParts: string[] = [];

    if (issues.includes("emojis")) {
      reasonParts.push("emojis");
    }
    if (issues.includes("illegal_characters")) {
      reasonParts.push("illegal characters");
    }
    if (issues.includes("inappropriate_language")) {
      reasonParts.push("inappropriate language");
    }
    if (issues.includes("excessive_special_characters")) {
      reasonParts.push("excessive special characters");
    }
    if (issues.includes("suspicious_patterns")) {
      reasonParts.push("suspicious patterns");
    }

    reason += reasonParts.join(", ") + ". Please revise your message.";

    return {
      isValid: false,
      reason,
      detectedIssues: issues,
    };
  }

  return {
    isValid: true,
    detectedIssues: [],
  };
}

/**
 * Sanitizes text by removing problematic content (optional utility)
 */
export function sanitizeContent(text: string): string {
  let sanitized = text;

  // Remove emojis using the same comprehensive regex
  sanitized = sanitized.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F251}]|[\u{1F910}-\u{1F96B}]|[\u{1F980}-\u{1F997}]|[\u{1F9C0}-\u{1F9E6}]|[\u{1FA70}-\u{1FAFF}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{23CF}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu,
    ""
  );

  // Remove illegal characters
  ILLEGAL_CHARACTERS.forEach(char => {
    sanitized = sanitized.replace(
      new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      ""
    );
  });

  // Clean up multiple spaces
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
}
