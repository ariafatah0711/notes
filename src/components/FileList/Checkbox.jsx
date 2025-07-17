const Checkbox = ({ isChecked, onChange }) => {
return (
    <label onClick={(e) => e.stopPropagation()} className="inline-flex items-center cursor-pointer">
    <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="hidden"
    />
    <span className="w-6 h-6 flex items-center justify-center border-2 border-gray-300 rounded-md bg-white text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg
        className={`w-4 h-4 transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
        />
        </svg>
    </span>
    </label>
    );
};

export default Checkbox;
