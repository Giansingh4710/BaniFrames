import { useEffect, useRef, useState } from "react";
import { CurrentBani } from "../assets/types.ts";
import { BaniApiData, Verse } from "../assets/bani_api_type.ts";
import { HTMLDivElement } from "react";

const fonts = [
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
    fetch(`https://api.banidb.com/v2/banis/${currBani.ID}`)
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
  const [selectedFont, setFont] = useState<string>(fonts[0]);

  const baniViewDiv = useRef<HTMLDivElement>();
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
            if (0 !== bani_data.verses[verseIdx].header) {
              title = bani_data.verses[verseIdx + 1].verse.verse.unicode;
            }
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
    useEffect(() => {
      baniViewDiv.current.scrollTop = scrollTo.current;
    }, []);

    return (
      <div className="w-full ">
        <div
          ref={baniViewDiv}
          className="text-white mx-2 my-1 p-2 h-[500px] overflow-auto border border-sky-500 rounded text-wrap"
          style={{ fontSize: `${fontSize}px` }}
        >
          {verses.map((obj: Verse, idx: number) => {
            const paragraph = obj.paragraph;
            // const pangti = obj.verse.verse.unicode;
            const pangti = obj.verse.verse.gurmukhi;
            const larivaarLine = obj.verse.larivaar.gurmukhi;
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
                  className="break-all inline"
                  onClick={() => {
                    scrollTo.current = baniViewDiv.current.scrollTop;
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
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx === 0) return;
            setCurrPartitionIdx(currPartitionIdx - 1);
            scrollTo.current = 0;
          }}
        >
          Back
        </button>
        <button
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => setParaMode(!paragraphMode)}
        >
          Toggle Paragraph Mode
        </button>
        <button
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => setLarivaarOn(!larivaarOn)}
        >
          Toggle Larivaar
        </button>
        <button
          className="px-4 py-2 border border-sky-500 rounded bg-white text-sky-500 cursor-pointer transition duration-300 hover:bg-sky-100 active:bg-sky-200 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
          onClick={() => {
            if (currPartitionIdx + 1 === partitions.length) return;
            setCurrPartitionIdx(currPartitionIdx + 1);
            scrollTo.current = 0;
          }}
        >
          Next
        </button>
      </div>
    );
  };

  const ChooseFont = () => {
    return (
      <div className="flex flex-col items-center">
        <select
          className="m-1 mb-0 border border-sky-500 rounded bg-white text-black text-xs"
          value={selectedFont}
          onChange={(event) => {
            setFont(event.currentTarget.value);
          }}
        >
          {fonts.map((fontName, idx) => (
            <option key={idx} value={fontName}>
              Font: {fontName}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-74px)]">
      <ChooseFont />
      <div style={{ fontFamily: selectedFont }}>
        <SelectOptions />
        <DisplayVerses />
      </div>
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
