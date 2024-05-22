interface CurrentBani {
  ID: number;
  token: string;
  gurmukhiUni: string;
  partitions: number[];
}

interface ShowBaniProps {
  currBani: CurrentBani | undefined;
  setCurrBani: Function;
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



export type { CurrentBani, ShowBaniProps, BaniPartitions };
