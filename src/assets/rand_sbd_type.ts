// this file is not used. Just type got rand shabad from API.
interface ShabadLine {
  line: {
    id: string;
    type: number;
    gurmukhi: {
      akhar: string;
      unicode: string;
    };
    larivaar: {
      akhar: string;
      unicode: string;
    };
    translation: {
      english: {
        default: string;
      };
      punjabi?: {
        default?: {
          akhar?: string;
          unicode?: string;
        };
      };
      spanish?: string;
    };
    transliteration: {
      english: {
        text: string;
        larivaar: string;
      };
      devanagari: {
        text: string;
        larivaar: string;
      };
    };
    linenum: number;
    firstletters: {
      akhar: string;
      unicode: string;
    };
  };
}

interface ShabadType {
  shabadinfo: {
    shabadid: string;
    pageno: number;
    source: {
      id: number;
      akhar: string;
      unicode: string;
      english: string;
      length: number;
      pageName: {
        akhar: string;
        unicode: string;
        english: string;
      };
    };
    writer: {
      id: number;
      akhar: string;
      unicode: string;
      english: string;
    };
    raag: {
      id: number;
      akhar: string;
      unicode: string;
      english: string;
      startang: number;
      endang: number;
      raagwithpage: string;
    };
    navigation: {
      previous: {
        id: string;
      };
      next: {
        id: string;
      };
    };
    count: number;
  };
  shabad: ShabadLine[];
  error: boolean;
}

export type { ShabadType };
