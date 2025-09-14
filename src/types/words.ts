export interface IWordVariant {
  name: string;
  group: string;
  word_ru: string;
  word_ru_prefix: string;
  sort_order: number;
  win_percent: number;
  subcategory: string;
  rules: number[];
}

export interface IWord {
  word_ru: string;
  word_en: string;
  category: string;
  locked: boolean;
  type: string;
  variants: IWordVariant[];
}

export interface IWordsResponse {
  words: IWord[];
  pages: number;
}
