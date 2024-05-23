import React from "react";

function Header({
  title,
  onBackClick,
}: {
  title: string;
  onBackClick: Function;
}) {
  return (
    <div className="flex flex-row overflow-auto bg-red-400 justify-center ">
      <button
        className="p-1 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        onClick={() => onBackClick()}
      >
        {"<-"} Back
      </button>
      <h1 className="flex-1 flex items-center justify-center pr-10 text-2xl font-extrabold">
        {title}
      </h1>
    </div>
  );
}

export default Header;
