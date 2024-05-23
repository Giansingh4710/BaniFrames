interface CurrentBani {
  ID: number;
  token: string;
  gurmukhiUni: string;
  partitions: number[];
}


type BaniPartitions = {
  [key in BaniPartitionKey]: number[];
};

enum BaniPartitionKey {
  japji = "japji",
  jaap = "jaap",
  svaiye = "svaiye",
  chaupai = "chaupai",
  anand = "anand",
  sukhmani = "sukhmani",
  asadivar = "asadivar",
  bavanakhree = "bavanakhree",
  sidhgosht = "sidhgosht",
  dhakhnioankar = "dhakhnioankar",
  ogardanti = "ogardanti",
  akalustat = "akalustat",
}

interface BaniInfo {
  ID: number;
  token: string;
  gurmukhi: string;
  gurmukhiUni: string;
  transliteration: string;
  transliterations: {
    english: string;
    hindi: string;
    en: string;
    hi: string;
    ipa: string;
    ur: string;
  };
  updated: string;
}

interface BaniToken {
  token: string;
}

interface BaniGroup {
  title: string;
  banis: BaniToken[];
}

type BaniDisplayOrder = (BaniGroup | BaniToken)[];


export type { CurrentBani, BaniPartitions, BaniInfo,BaniToken,BaniGroup,BaniDisplayOrder};
