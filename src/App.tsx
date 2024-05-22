import { useEffect, useState } from "react";
import {
  ALL_BANIS_DATA,
  Bani_Display_Order,
  bani_partitions,
} from "./assets/banis_data";
import {
  BaniPartitions,
  CurrentBani,
  ShowBaniProps,
  BaniInfo,
  BaniToken,
  BaniGroup,
  BaniDisplayOrder,
} from "./assets/types";
import { BaniApiData } from "./assets/bani_api_type";

function App() {
  const [currBani, setCurrBani] = useState<CurrentBani | undefined>();
  if (currBani)
    return <ShowBani currBani={currBani} setCurrBani={setCurrBani} />;

  return (
    <div className="">
      <BanisList setCurrBani={setCurrBani} />
    </div>
  );
}

function ShowBani({ currBani, setCurrBani }: ShowBaniProps) {
  const [bani_data, setBaniData] = useState<BaniApiData>();
  useEffect(() => {
    if (!currBani) return;
    // fetch(`./banis/japji.json`)
    // fetch(`./assets/banis/${currBani?.token}.json`)
    fetch(`https://api.banidb.com/v2/banis/${currBani.ID}`)
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
  const [toggleLineLarivaar, setLarivaar] = useState({
    larivaarOff: false,
    verseIdx: 0,
  });
  const [fontSize, setFontSize] = useState<number>(16); // Initial font size

  if (!bani_data) return null;
  let curr_paragraph = -1;

  let verses;
  if (currPartitionIdx === partitions.length - 1)
    verses = bani_data.verses.slice(partitions[currPartitionIdx]);
  else {
    verses = bani_data.verses.slice(
      partitions[currPartitionIdx],
      partitions[currPartitionIdx + 1],
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-74px)] items-center">
      <select
        onChange={(e) => {
          const idx = parseInt(e.currentTarget.value);
          setCurrPartitionIdx(idx);
        }}
        value={currPartitionIdx}
      >
        {partitions.map((verseIdx, idx) => {
          let title = bani_data.verses[verseIdx].verse.verse.unicode;
          if ("sloku ]" === bani_data.verses[verseIdx].verse.verse.gurmukhi)
            title = bani_data.verses[verseIdx + 1].verse.verse.unicode;
          return (
            <option key={idx} value={idx}>
              {`${idx + 1}: ${title}`}
            </option>
          );
        })}
      </select>
      <div
        className="w-full m-12 p-6  overflow-auto border border-sky-500 rounded"
        style={{ fontSize: `${fontSize}px` }}
      >
        {verses.map((obj, idx) => {
          const paragraph = obj.paragraph;

          const pangti = obj.verse.verse.unicode;
          const larivaar = obj.verse.larivaar.unicode;
          const translation = obj.verse.translation.en.bdb;
          let add_space = false;
          if (paragraph !== curr_paragraph) {
            curr_paragraph = paragraph;
            add_space = true;
          }
          return (
            <div key={idx}>
              {add_space && <br />}
              <p
                onClick={() => {
                  let larivaarOff = true; // default to larivaar off when click on line
                  if (toggleLineLarivaar.verseIdx === idx) {
                    larivaarOff = !toggleLineLarivaar.larivaarOff;
                  }
                  setLarivaar({
                    larivaarOff: larivaarOff,
                    verseIdx: idx,
                  });
                }}
                onDoubleClick={() => {
                  alert(translation);
                }}
              >
                {toggleLineLarivaar.larivaarOff &&
                toggleLineLarivaar.verseIdx === idx
                  ? pangti
                  : larivaar}
              </p>
            </div>
          );
        })}
      </div>
      <div className="w-full m-4">
        <input
          type="range"
          min="6"
          max="96"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="appearance-none bg-blue-300 h-3 rounded-full w-full outline-none cursor-pointer"
        />
        <div className="-mt-1 flex justify-between text-gray-500">
          <span>6px</span>
          <span>96px</span>
        </div>
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
  const [baniList, setBaniList] =
    useState<BaniDisplayOrder>(Bani_Display_Order);
  return (
    <div className="flex flex-col overflow-auto bg-red-400 p-4 space-y-2">
      {baniList.map((obj, idx) => {
        let bani_title;
        let onClickFunc;

        if (isBaniToken(obj)) {
          const { token, gurmukhiUni, ID } = getObjFromToken(obj.token);
          bani_title = gurmukhiUni;
          const partitions: number[] =
            bani_partitions[token as keyof BaniPartitions];
          onClickFunc = () => {
            setCurrBani({
              ID,
              token,
              gurmukhiUni,
              partitions,
            });
          };
        } else {
          bani_title = obj["title"];
          onClickFunc = () => {
            setBaniList(obj["banis"]);
          };
        }

        return (
          <button
            key={idx}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={onClickFunc}
          >
            <h1 className="text-lg">{bani_title}</h1>
          </button>
        );
      })}
      <br />
    </div>
  );
}

function getObjFromToken(token: string) {
  return ALL_BANIS_DATA.find((obj) => obj.token === token) as BaniInfo;
}

function isBaniToken(obj: BaniGroup | BaniToken): obj is BaniToken {
  return (obj as BaniToken).token !== undefined;
}

export default App;
