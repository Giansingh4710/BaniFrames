import React, { useEffect, useState } from "react";
import { CurrentBani } from "../assets/types.ts";
import { BaniApiData, Verse } from "../assets/bani_api_type.ts";

function ShowBani({ currBani }: { currBani: CurrentBani }) {
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

  return <BaniText bani_data={bani_data} partitions={currBani.partitions} />;
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
  const [fontSize, setFontSize] = useState<number>(18); // Initial font size

  if (!bani_data) return null;
  let last_paragraph = -1;

  let verses: Verse[] = [];
  if (currPartitionIdx === partitions.length - 1)
    verses = bani_data.verses.slice(partitions[currPartitionIdx]);
  else {
    verses = bani_data.verses.slice(
      partitions[currPartitionIdx],
      partitions[currPartitionIdx + 1],
    );
  }

  const SelectOptions = () => {
    // vertical center = 'flex flex-col items-center'
    return (
      <div className="flex flex-col items-center">
        <select
          className="m-1 mb-0 border border-sky-500 rounded bg-white text-black text-xs"
          onChange={(event) => {
            const idx = parseInt(event.currentTarget.value);
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
      </div>
    );
  };

  const DisplayVerses = () => {
    return (
      <div className="w-full ">
        <div
          className="mx-2 my-1 p-2 h-[550px] overflow-auto border border-sky-500 rounded"
          style={{ fontSize: `${fontSize}px` }}
        >
          {verses.map((obj: Verse, idx: number) => {
            const paragraph = obj.paragraph;
            const pangti = obj.verse.verse.unicode;
            const larivaar = obj.verse.larivaar.unicode;
            const translation = obj.verse.translation.en.bdb;
            let add_space = false;
            if (paragraph !== last_paragraph) {
              last_paragraph = paragraph;
              add_space = true;
            }
            return (
              <div key={obj.verse.verseId}>
                {add_space && <br />}
                <button
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
                    console.log(translation)
                    alert(translation);
                  }}
                >
                  {toggleLineLarivaar.larivaarOff &&
                  toggleLineLarivaar.verseIdx === idx
                    ? pangti
                    : larivaar}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Slider = () => {
    return (
      <div className="w-full p-2">
        <div>
          <span className="text-lg flex flex-col items-center">
            Font Size: {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="6"
          max="64"
          step="1"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="appearance-none bg-blue-300 h-3 rounded-full w-full outline-none cursor-pointer"
        />
        <div className="-mt-1 flex justify-between text-gray-500">
          <span>6px</span>
          <span>64px</span>
        </div>
      </div>
    );
  };

  const ButtomButtons = () => {
    return (
      <div className="  p-2 flex flex-row justify-around">
        <button
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx === 0) return;
            setCurrPartitionIdx(currPartitionIdx - 1);
          }}
        >
          Back
        </button>
        <button
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx + 1 === partitions.length) return;
            setCurrPartitionIdx(currPartitionIdx + 1);
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-74px)]">
      <SelectOptions />
      <DisplayVerses />
      <Slider />
      <ButtomButtons />
    </div>
  );
}

export default ShowBani;
