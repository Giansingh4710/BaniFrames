import { useEffect, useRef, useState } from "react";
import { CurrentBani } from "../assets/types.ts";
import { BaniApiData, Verse } from "../assets/bani_api_type.ts";
import { IoArrowBack } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";

const fonts = [
  "unicode",
  "amrlipiheavyregular",
  "anmollipiregular",
  "choti",
  "adhiapakblack",
  "adhiapakbold",
  "adhiapakchiselblack",
  "adhiapakbook",
  "adhiapakmedium",
  "adhiapaklight",
  "adhiapakextralight",
];

function ShowBani({ currBani }: { currBani: CurrentBani }) {
  const [bani_data, setBaniData] = useState<BaniApiData>();
  useEffect(() => {
    if (!currBani) return;
    // fetch(`./banis/japji.json`)
    // fetch(`./assets/banis/${currBani?.token}.json`)
    // console.log(`https://api.banidb.com/v2/banis/${currBani.ID}`);
    fetch(`https://api.banidb.com/v2/banis/${currBani.ID}`, {
      cache: "force-cache",
    })
      .then((res) => res.json())
      .then((data) => {
        data.verses = data.verses.filter(
          (verse: Verse) => verse.mangalPosition !== "above",
        );
        setBaniData(data);
      })
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
  const [larivaarOn, setLarivaarOn] = useState(true);
  const [toggleLineLarivaar, setLineLarivaar] = useState({
    larivaarOff: false,
    verseIdx: -1,
  });
  const [paragraphMode, setParaMode] = useState(false);

  const [fontSize, setFontSize] = useState<number>(18); // Initial font size

  const baniViewDiv = useRef<HTMLDivElement>(null);
  // const baniViewDiv = useRef();
  const scrollTo = useRef(0);

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
    // showNumbers(bani_data);
  }

  const SelectOptions = () => {
    function getRightSize(str: string) {
      const bestSize = 50;
      if (str.length < bestSize) return str;
      return str.slice(0, bestSize) + "...";
    }

    return (
      <div
        className="flex flex-col items-center"
        // style={{ fontFamily: selectedFont }}
      >
        <select
          className="m-1 p-1 border border-sky-500 rounded bg-white text-black text-xs"
          onChange={(event) => {
            const idx = parseInt(event.currentTarget.value);
            setCurrPartitionIdx(idx);
          }}
          value={currPartitionIdx}
        >
          {partitions.map((verseIdx, idx) => {
            let title = bani_data.verses[verseIdx].verse.verse.unicode;
            if (0 !== bani_data.verses[verseIdx].header) {
              for (let i = 0; i < 3; i++) {
                title = bani_data.verses[verseIdx + i].verse.verse.unicode;
                if (0 === bani_data.verses[verseIdx + i].header) {
                  break;
                }
              }
            }
            return (
              <option key={idx} value={idx}>
                {getRightSize(`${idx + 1}: ${title}`)}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const DisplayVerses = () => {
    useEffect(() => {
      if (baniViewDiv.current) baniViewDiv.current.scrollTop = scrollTo.current;
    }, []);

    return (
      <div
        className="w-full"
        // style={{ fontFamily: selectedFont }}
      >
        <div
          ref={baniViewDiv}
          className="text-white mx-2 my-1 p-2 h-[500px] overflow-auto border border-sky-500 rounded text-wrap"
          style={{ fontSize: `${fontSize}px` }}
        >
          {verses.map((obj: Verse, idx: number) => {
            const paragraph = obj.paragraph;
            const pangti = obj.verse.verse.unicode;
            // const pangti = obj.verse.verse.gurmukhi;
            // const larivaarLine = obj.verse.larivaar.gurmukhi;
            const larivaarLine = pangti.replace(/ /g, "");
            const translation = obj.verse.translation.en.bdb;
            let add_space = false;
            if (paragraph !== last_paragraph) {
              last_paragraph = paragraph;
              add_space = true;
            }
            let line = larivaarOn ? larivaarLine : pangti;
            if (toggleLineLarivaar.verseIdx === idx) {
              line = toggleLineLarivaar.larivaarOff ? pangti : larivaarLine;
            }
            return (
              <div
                key={obj.verse.verseId}
                className={paragraphMode ? "inline" : ""}
              >
                {add_space && (
                  <div>
                    <br />
                  </div>
                )}
                <p
                  className={larivaarOn ? "break-all" : "break-word"}
                  onClick={() => {
                    if (baniViewDiv.current?.scrollTop) {
                      scrollTo.current = baniViewDiv.current.scrollTop;
                    }

                    let larivaarOff = larivaarOn; // Default
                    if (toggleLineLarivaar.verseIdx === idx) {
                      larivaarOff = !toggleLineLarivaar.larivaarOff;
                    }
                    setLineLarivaar({
                      larivaarOff: larivaarOff,
                      verseIdx: idx,
                    });
                  }}
                  onDoubleClick={() => {
                    console.log(translation);
                    alert(translation);
                  }}
                >
                  {line}
                </p>
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
      <div className="p-2 flex flex-row justify-around gap-1 text-xs">
        <button
          className="px-4 py-1 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx === 0) return;
            setCurrPartitionIdx(currPartitionIdx - 1);
            scrollTo.current = 0;
          }}
        >
          <IoArrowBack size={30} />
        </button>
        <button
          className="px-4 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => setParaMode(!paragraphMode)}
        >
          Toggle Paragraph
        </button>
        <button
          className="px-4  border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => setLarivaarOn(!larivaarOn)}
        >
          Toggle Larivaar
        </button>
        <button
          className="px-4 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx + 1 === partitions.length) return;
            setCurrPartitionIdx(currPartitionIdx + 1);
            scrollTo.current = 0;
          }}
        >
          <IoArrowForward size={30} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-74px)]">
      <SelectOptions />
      <DisplayVerses />
      <ButtomButtons />
      <Slider />
    </div>
  );
}

/*
function showNumbers(bani_data: BaniApiData) {
  const verses = bani_data.verses;
  const seen_paragraphs = new Set<number>();
  for (let i = 0; i < verses.length; i++) {
    if (seen_paragraphs.has(verses[i].paragraph)) continue;
    seen_paragraphs.add(verses[i].paragraph);
    // console.log(i, ":", verses[i].verse.verse.unicode);
  }
}
*/

export default ShowBani;
