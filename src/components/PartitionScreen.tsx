import React, { useEffect, useMemo, useRef, useState } from "react";
import { BaniApiData, Verse } from "../assets/bani_api_type.ts";
import {
  ALL_BANIS_DATA,
  Bani_Display_Order,
  bani_partitions,
} from "../assets/banis_data.ts";

import { BaniPartitions, BaniInfo } from "../assets/types.ts";
import Header from "./Header.tsx";

interface PartitionScreenProps {
  setShowPartitionScreen: Function;
}
export default function ShowBani({
  setShowPartitionScreen,
}: PartitionScreenProps) {
  const [allBaniIdx, setAllBaniIdx] = useState(-1);
  const currentBani = ALL_BANIS_DATA[allBaniIdx];
  const [bani_data, setBaniData] = useState<BaniApiData>();

  return (
    <div className="h-svh bg-gray-800 text-white p-4">
      <Header
        title={"Find the Index Number of Line in a Bani to Make Partitions"}
        onBackClick={() => setShowPartitionScreen(false)}
      />

      <select
        className="m-2 p-2 border rounded bg-white text-black text-sm"
        onChange={async (event) => {
          const idx = parseInt(event.currentTarget.value);
          const call = await fetch(
            `https://api.banidb.com/v2/banis/${ALL_BANIS_DATA[idx].ID}`,
            { cache: "force-cache" },
          );
          const data = await call.json();
          setAllBaniIdx(idx);
          setBaniData(data);
        }}
        value={allBaniIdx}
      >
        {ALL_BANIS_DATA.map((bani, idx) => (
          <option key={idx} value={idx}>
            {bani.gurmukhiUni}
          </option>
        ))}
      </select>
      <ShowDetails currentBani={currentBani} />
      <ShowLines currentBani={currentBani} bani_data={bani_data} />
    </div>
  );
}

interface AllTheLinesProps {
  bani_data?: BaniApiData;
  currentBani: BaniInfo;
}
function ShowLines({ bani_data, currentBani }: AllTheLinesProps) {
  const [showLines, setShowLines] = useState(true);
  if (bani_data === undefined || currentBani === undefined) return null;
  return (
    <div className="bg-gray-700 p-4 rounded mt-4 space-y-2">
      <div>
        <button
          className={`p-2 m-2 font-bold rounded
        ${showLines ? "bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          onClick={() => setShowLines(true)}
        >
          Show All Lines
        </button>

        <button
          className={`p-2 m-2 font-bold rounded
        ${!showLines ? "bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          onClick={() => setShowLines(false)}
        >
          Show Partitions
        </button>
      </div>
      {showLines ? (
        <AllTheLines bani_data={bani_data} />
      ) : (
        <ThePartions bani_data={bani_data} currentBani={currentBani} />
      )}
    </div>
  );
}

function AllTheLines({ bani_data }: { bani_data?: BaniApiData }) {
  const [isReversed, setIsReversed] = useState(false);
  const lines = [];
  if (!bani_data) return null;
  if (isReversed) {
    for (let i = bani_data.verses.length - 1; i > -1; i--) {
      lines.push(
        <li key={i} className="mb-1">
          <span className="font-bold text-blue-300">{i}:</span>{" "}
          {bani_data?.verses[i].verse.verse.unicode}
        </li>,
      );
    }
  } else {
    for (let i = 0; i < bani_data?.verses.length; i++) {
      lines.push(
        <li key={i} className="mb-1">
          <span className="font-bold text-blue-300">{i}:</span>{" "}
          {bani_data?.verses[i].verse.verse.unicode}
        </li>,
      );
    }
  }

  return (
    <div>
      <div className="flex flex-row">
        <h4 className="font-semibold text-sm mb-2">Lines:</h4>
        <button
          className="m-1 p-1  border border-sky-500 rounded bg-white text-black text-xs"
          onClick={() => {
            setIsReversed(!isReversed);
          }}
        >
          ReverseLinks
        </button>
      </div>
      <ul className="list-none">{lines}</ul>
    </div>
  );
}

function ThePartions({ bani_data, currentBani }: AllTheLinesProps) {
  const partition =
    bani_partitions[currentBani.token as keyof BaniPartitions] || [];

  if (bani_data === undefined) return null;
  console.log(currentBani.token, bani_data.verses.length);
  partition.map((p) => {
    if (bani_data.verses[p]) {
      console.log(bani_data.verses[p].verse.verse.unicode);
    } else {
      console.log(currentBani.token, bani_data.verses.length, p, " not found");
    }
  });
  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">Partitions:</h4>
      {partition.length === 0 && <p>No partitions found</p>}
      <ul className="list-none">
        {partition.map((p) => (
          <li key={p} className="mb-1">
            <span className="font-bold text-blue-300">{p}:</span>{" "}
            {bani_data.verses[p].verse.verse.unicode}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShowDetails({ currentBani }: { currentBani: BaniInfo }) {
  const [detailsShow, setDetailsShow] = useState(false);
  if (currentBani === undefined) return null;
  return (
    <>
      <button
        className="m-1 p-1  border border-sky-500 rounded bg-white text-black text-xs"
        onClick={() => setDetailsShow(!detailsShow)}
      >
        Toggle Details
      </button>
      {detailsShow && (
        <div className="bg-gray-700 p-4 rounded mt-4">
          <h4 className="font-semibold text-sm mb-2">Details:</h4>
          <ul className="list-none">
            {Object.keys(currentBani).map((key) => (
              <li key={key} className="mb-1">
                <span className="font-bold text-blue-300">{key}:</span>{" "}
                {typeof currentBani[key] === "object" ? (
                  // If the value is an object, render its keys and values
                  <ul className="ml-4 list-disc">
                    {Object.keys(currentBani[key]).map((subKey) => (
                      <li key={subKey}>
                        <span className="font-semibold">{subKey}:</span>{" "}
                        {currentBani[key][subKey]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>{currentBani[key]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
