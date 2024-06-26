import { useState, useMemo } from "react";
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

import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa"; //filled star

function App() {
  const [currBani, setCurrBani] = useState<CurrentBani | undefined>();
  const [baniList, setBaniList] =
    useState<BaniDisplayOrder>(Bani_Display_Order);

  const [favBaniList, setFavBaniList] = useState<BaniToken[]>(getFavBanis());
  useMemo(() => {
    saveFavBanis(favBaniList);
  }, [favBaniList]);

  if (currBani) {
    return (
      <ShowBani currBani={currBani} goBack={() => setCurrBani(undefined)} />
    );
  }

  return (
    <div className="h-svh bg-gray-800">
      <Header
        title="Bani Frames"
        onBackClick={() => {
          setBaniList(Bani_Display_Order);
        }}
        rightComponent={undefined}
      />
      <BanisList
        setCurrBani={setCurrBani}
        baniList={baniList}
        setBaniList={setBaniList}
        favList={favBaniList}
        setFavList={setFavBaniList}
      />

      <ShowFavBanis
        favList={favBaniList}
        setFavList={setFavBaniList}
        setCurrBani={setCurrBani}
      />
    </div>
  );
}

function BanisList({
  setCurrBani,
  baniList,
  setBaniList,
  favList,
  setFavList,
}: {
  setCurrBani: Function;
  baniList: BaniDisplayOrder;
  setBaniList: Function;
  favList: BaniToken[];
  setFavList: Function;
}) {
  return (
    <div>
      <div className="m-10 flex flex-col overflow-auto bg-gray-600 p-4 space-y-2 rounded-lg">
        {baniList.map((obj: BaniGroup | BaniToken, idx: number) => (
          <BaniOpt
            obj={obj}
            idx={idx}
            setCurrBani={setCurrBani}
            setBaniList={setBaniList}
            favList={favList}
            setFavList={setFavList}
          />
        ))}
        <br />
      </div>
    </div>
  );
}

function BaniOpt({
  obj,
  idx,
  setCurrBani,
  setBaniList,
  favList,
  setFavList,
}: {
  obj: BaniGroup | BaniToken;
  idx: number;
  setCurrBani: Function;
  setBaniList: Function;
  favList: BaniToken[];
  setFavList: Function;
}) {
  const isFav = favList.some((bani) => bani.token === obj.token);
  let bani_title;
  let onClickFunc;
  const isBaniOpt = isBaniToken(obj);

  if (isBaniOpt) {
    const { token, gurmukhiUni, ID } = getObjFromToken(obj.token);
    bani_title = gurmukhiUni;
    if (!(token in bani_partitions)) {
      return;
    }
    const partitions: number[] = bani_partitions[token as keyof BaniPartitions];
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
    <div key={idx} className="flex gap-2">
      <button
        className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        onClick={onClickFunc}
      >
        <h1 className="text-lg">{bani_title}</h1>
      </button>
      {isBaniOpt && (
        <button
          onClick={() => {
            if (isFav) {
              setFavList(favList.filter((bani) => bani.token !== obj.token));
              // removeBaniFromFavorites(obj.token);
            } else {
              // addBaniToFavorites(obj.token);
              setFavList([...favList, obj]);
            }
          }}
        >
          {isFav ? <FaStar /> : <FaRegStar />}
        </button>
      )}
    </div>
  );
}

function ShowFavBanis({
  favList,
  setFavList,
  setCurrBani,
}: {
  favList: BaniToken[];
  setFavList: Function;
  setCurrBani: Function;
}) {
  return (
    <div>
      <div className="m-10 flex flex-col overflow-auto bg-gray-600 p-4 space-y-2 rounded-lg">
        <h1 className="text-2xl font-bold">Favorite Banis</h1>
        {favList.map((obj, idx) => (
          <BaniOpt
            obj={obj}
            idx={idx}
            setCurrBani={setCurrBani}
            setBaniList={() => {}}
            favList={favList}
            setFavList={setFavList}
          />
        ))}
      </div>
    </div>
  );
}

function getObjFromToken(token: string) {
  return ALL_BANIS_DATA.find((obj) => obj.token === token) as BaniInfo;
}

function saveFavBanis(favList: BaniToken[]) {
  const favs = favList.map((bani) => bani.token).join(",");
  localStorage.setItem("bani_favorites", favs);
}

function getFavBanis() {
  const favs = localStorage.getItem("bani_favorites");
  if (favs === null) {
    return [];
  }
  const favLst = favs.split(",").map((token) => {
    return { token: token } as BaniToken;
  });
  return favLst.filter((bani) => bani.token !== "");
}

function isBaniToken(obj: BaniGroup | BaniToken): obj is BaniToken {
  return (obj as BaniToken).token !== undefined;
}

function baniInFavorites(token: string) {
  const favs = localStorage.getItem("bani_favorites"); //string
  if (favs === null) {
    return false;
  }
  return favs.includes(token);
}

export default App;
