interface BaniInfo {
  baniID: number;
  gurmukhi: string;
  unicode: string;
  english: string;
  hindi: string;
  en?: string; // optional english property
  hi?: string; // optional hindi property
  ipa?: string; // optional ipa property
  ur?: string; // optional urdu property
  source?: Source; // optional source property
  raag?: Raag; // optional raag property
  writer?: Writer; // optional writer property
}

interface Source {
  sourceId?: number | null;
  gurmukhi?: string | null;
  unicode?: string | null;
  english?: string | null;
  pageNo?: number | null;
}

interface Raag {
  raagId?: number | null;
  gurmukhi?: string | null;
  unicode?: string | null;
  english?: string | null;
  raagWithPage?: string | null;
}

interface Writer {
  writerId?: number | null;
  gurmukhi?: string | null;
  unicode?: string | null;
  english?: string | null;
}

interface Verse {
  header: number;
  mangalPosition?: number | null;
  existsSGPC: number;
  existsMedium: number;
  existsTaksal: number;
  existsBuddhaDal: number;
  paragraph: number;
  verse: {
    verseId: number;
    verse: {
      gurmukhi: string;
      unicode: string;
    };
    larivaar: {
      gurmukhi: string;
      unicode: string;
    };
    translation: {
      en: { bdb: string }; // english translation with bdb property
      pu?: { ss: { gurmukhi?: string; unicode?: string } }; // optional punjabi translation with ss property
      es?: { sn?: string }; // optional spanish translation with sn property
      hi?: {}; // empty object for consistency
    };
    transliteration: {
      english: string;
      hindi: string;
      en: string;
      hi: string;
      ipa?: string; // optional ipa property
      ur?: string; // optional urdu property
    };
    pageNo?: number | null;
    lineNo?: number | null;
    updated: string;
    visraam: {
      sttm?: string[];
      igurbani?: string[];
      sttm2?: string[];
    };
  };
}

interface BaniApiData {
  baniInfo: BaniInfo;
  verses: Verse[];
}

export type { BaniInfo, Source, Raag, Writer, Verse, BaniApiData };
