import { useEffect, useState } from "react";
import { ALL_BANIS_DATA, bani_partitions } from "./assets/banis_data";
import { BaniPartitions, CurrentBani, ShowBaniProps } from "./assets/types";
import { BaniApiData } from "./assets/bani_api_type";

function App() {
  const [currBani, setCurrBani] = useState<CurrentBani | undefined>();
  if (currBani)
    return <ShowBani currBani={currBani} setCurrBani={setCurrBani} />;

  return (
    <div className="flex pt-10 justify-center ">
      <BanisList setCurrBani={setCurrBani} />
    </div>
  );
}

function ShowBani({ currBani, setCurrBani }: ShowBaniProps) {
  const [bani_data, setBaniData] = useState<BaniApiData>();
  useEffect(() => {
    if (!currBani) return;
    fetch(`./banis/japji.json`)
      // fetch(`./assets/banis/${currBani?.token}.json`)
      // fetch(`https://api.banidb.com/v2/banis/${currBani.ID}`)
      .then((res) => res.json())
      .then((data) => setBaniData(data))
      .catch((err) => console.log(err));
  }, []);
  if (!currBani) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row overflow-auto bg-red-400 justify-center ">
        <button
          className="basis-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1"
          onClick={() => {
            setCurrBani(undefined);
          }}
        >
          Go Back
        </button>
        <h1 className="text-center flex-1 p-2 text-5xl font-extrabold">
          {currBani.gurmukhiUni}
        </h1>
      </div>
      <BaniText bani_data={bani_data} partitions={currBani.partitions} />
    </div>
  );
}

function BaniText({
  bani_data,
  partitions,
}: {
  bani_data: BaniApiData | undefined;
  partitions: number[];
}) {
  const [currPartitionIdx, setCurrPartitionIdx] = useState<number>(0);
  const [larivaarOn, setLarivaar] = useState(true);

  if (!bani_data) return null;
  let curr_paragraph = -1;

  const verses = bani_data.verses.filter((obj) => {
    if (currPartitionIdx === 0)
      return obj.paragraph < partitions[currPartitionIdx];
    else if (currPartitionIdx + 1 === partitions.length)
      return obj.paragraph >= partitions[currPartitionIdx];

    if (obj.paragraph >= partitions[currPartitionIdx - 1]) {
      return obj.paragraph < partitions[currPartitionIdx];
    }
    return false;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-74px)] items-center">
      <select
        onChange={(e) => {
          const idx = parseInt(e.currentTarget.value);
          setCurrPartitionIdx(idx);
        }}
        value={currPartitionIdx}
      >
        {partitions.map((paragraphNum, idx) => {
          const title =
            idx === 0
              ? bani_data.verses[0].verse.verse.unicode
              : bani_data.verses.find((obj) => obj.paragraph === paragraphNum)
                  ?.verse.verse.unicode;
          return (
            <option key={idx} value={idx}>
              {title}
            </option>
          );
        })}
      </select>
      <div className="w-full m-12 p-6  overflow-auto border border-sky-500 rounded">
        {verses.map((obj, _) => {
          const paragraph = obj.paragraph;
          console.log(paragraph, partitions[currPartitionIdx]);

          const pangti = obj.verse.verse.unicode;
          const larivaar = obj.verse.larivaar.unicode;
          const translation = obj.verse.translation.en.bdb;
          let add_space = false;
          if (paragraph !== curr_paragraph) {
            curr_paragraph = paragraph;
            add_space = true;
          }
          return (
            <div>
              {add_space && <br />}
              <p
                onClick={() => {
                  setLarivaar(!larivaarOn);
                }}
                onDoubleClick={() => {
                  // alert(translation);
                }}
              >
                {larivaarOn ? larivaar : pangti}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex-1 flex flex-row justify-around h-10  ">
        <button
          className=" m-1 p-2 border border-sky-500 rounded"
          onClick={() => {
            if (currPartitionIdx === 0) return;
            setCurrPartitionIdx(currPartitionIdx - 1);
          }}
        >
          Back
        </button>
        <button
          className=" m-1 p-2 border border-sky-500 rounded"
          onClick={() => {
            if (currPartitionIdx + 1 === partitions.length) return;
            setCurrPartitionIdx(currPartitionIdx + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function BanisList({ setCurrBani }: { setCurrBani: Function }) {
  return (
    <div className="flex flex-col  overflow-auto bg-red-400">
      {ALL_BANIS_DATA.map((obj) => {
        const { token, gurmukhiUni, ID } = obj;
        const partitions: number[] =
          bani_partitions[token as keyof BaniPartitions];

        if (!(token in bani_partitions)) return null;
        return (
          <button
            key={token}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1"
            onClick={() => {
              setCurrBani({
                ID,
                token,
                gurmukhiUni,
                partitions,
              });
            }}
          >
            <h1>{gurmukhiUni}</h1>
          </button>
        );
      })}
      <br />
    </div>
  );
}

export default App;
