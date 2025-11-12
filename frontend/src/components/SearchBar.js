function SearchBar({ value, onChange }) {
    return (
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search for movies"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Search movies"
        />
      </div>
    );
  }
  
  export default SearchBar;