import React from "react";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";

export const Search: React.FC<{}> = observer(() => {
  const store = useStore();

  const { searchQuery, updateSearchQuery } = store;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateSearchQuery(e.currentTarget.value);
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Type your query here..."
        className="search-input"
        value={searchQuery}
        onChange={handleChange}
      />
      <span className="material-icons">search</span>
    </div>
  );
});
