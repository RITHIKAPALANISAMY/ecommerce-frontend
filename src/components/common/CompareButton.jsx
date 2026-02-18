import { useCompare } from "../../context/CompareContext";

const CompareButton = ({ product }) => {
  const { compareItems, addToCompare, removeFromCompare } = useCompare();

  const isAdded = compareItems.some(item => item.id === product.id);

  const handleClick = () => {
    isAdded ? removeFromCompare(product.id) : addToCompare(product);
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-2 px-3 py-1 text-sm rounded border
        ${isAdded
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
    >
      {isAdded ? "Remove Compare" : "Add Compare"}
    </button>
  );
};

export default CompareButton;
