import React from "react";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";

export const Search: React.FC<{}> = observer(() => {
  const store = useStore();

  const { searchQuery, updateSearchQuery } = store;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateSearchQuery(e.currentTarget.value);
  };

  return <input type="search" value={searchQuery} onChange={handleChange} />;
});
