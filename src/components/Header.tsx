import { IoArrowBack } from "react-icons/io5";

function Header({
  onBackClick,
  title,
  rightComponent,
}: {
  title: string;
  onBackClick: Function;
  rightComponent: Function;
}) {
  return (
    <div className="h-15 flex flex-row overflow-auto bg-red-400 justify-center ">
      {onBackClick && (
        <button
          className="p-1 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={() => onBackClick()}
        >
          <IoArrowBack size={15} />
        </button>
      )}
      <h1 className="flex-1 flex items-center justify-center pr-10 text-xl font-extrabold">
        {title}
      </h1>
      <div className="flex-2">{rightComponent && rightComponent()}</div>
    </div>
  );
}

export default Header;
