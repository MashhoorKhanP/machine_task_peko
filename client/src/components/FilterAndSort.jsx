const FilterAndSort = ({
  handleFilterChange,
  filterValue,
  handleSortingChange,
  sortingValue,
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        {/* Filter dropdown */}
        <h2 className="text-lg font-bold p-2">Filter:</h2>
        <select
          className="border border-black rounded-md p-2 font-semibold"
          onChange={handleFilterChange}
          value={filterValue}
        >
          <option className="p-2" value="">
            All Categories
          </option>
          <option className="p-2" value="Web Development">
            Web Development
          </option>
          <option className="p-2" value="Art">
            Art
          </option>
          <option className="p-2" value="Technology">
            Technology
          </option>
        </select>

        {/* Sorting dropdown */}
        <h2 className="text-lg font-bold p-2">Sort:</h2>
        <select
          className="border border-black rounded-md p-2 font-semibold"
          onChange={handleSortingChange}
          value={sortingValue}
        >
          <option className="p-2" value="latest">
            Latest
          </option>
          <option className="p-2" value="relevant">
            Relevant
          </option>
        </select>
      </div>
    </div>
  );
};

export default FilterAndSort;
