export type DelimiterType = 'comma' | 'newline' | 'space' | 'semicolon' | 'dash' | 'custom';

export interface ClipboardItem {
  id: string;
  text: string;
  itemCount: number;
  timestamp: number;
  delimiter: DelimiterType;
}

export interface FormatOptions {
  trimItems: boolean;
  removeDuplicates: boolean;
  sortItems: boolean;
  outputFormat: 'plain' | 'json' | 'sql' | 'bullet';
}

export interface PresetSample {
  titleAr: string;
  titleEn: string;
  text: string;
  descriptionAr: string;
  descriptionEn: string;
}
