function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search movies"
      />
    </div>
  );
}

export default SearchBar;

