export default function SearchBar() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">
      <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
        🔍
        <input
          type="text"
          placeholder="Where do you want to go?"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>
    </div>
  );
}
