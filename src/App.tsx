import { useState } from "react";
import {
  ALL_BANIS_DATA,
  Bani_Display_Order,
  bani_partitions,
} from "./assets/banis_data.ts";
import {
  BaniPartitions,
  CurrentBani,
  BaniInfo,
  BaniToken,
  BaniGroup,
  BaniDisplayOrder,
} from "./assets/types.ts";
import Header from "./components/Header.tsx";
import ShowBani from "./components/BaniReadingScreen.tsx";

function App() {
  const [currBani, setCurrBani] = useState<CurrentBani | undefined>();
  const [baniList, setBaniList] =
    useState<BaniDisplayOrder>(Bani_Display_Order);

  if (currBani) {
    return (
      <ShowBani currBani={currBani} goBack={() => setCurrBani(undefined)} />
    );
  }

  return (
    <div className="h-svh bg-gray-800">
      <BanisList
        setCurrBani={setCurrBani}
        baniList={baniList}
        setBaniList={setBaniList}
      />
    </div>
  );
}

function BanisList({
  setCurrBani,
  baniList,
  setBaniList,
}: {
  setCurrBani: Function;
  baniList: BaniDisplayOrder;
  setBaniList: Function;
}) {
  return (
    <div>
      <Header
        title="Bani Frames"
        onBackClick={() => {
          setBaniList(Bani_Display_Order);
        }}
      />
      <div className="m-10 flex flex-col overflow-auto bg-gray-600 p-4 space-y-2 rounded-lg">
        {baniList.map((obj: BaniGroup | BaniToken, idx: number) => {
          let bani_title;
          let onClickFunc;

          if (isBaniToken(obj)) {
            const { token, gurmukhiUni, ID } = getObjFromToken(obj.token);
            bani_title = gurmukhiUni;
            if (!(token in bani_partitions)) {
              // console.log(`Token ${token} not found in bani_partitions`);
              return;
            }
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
