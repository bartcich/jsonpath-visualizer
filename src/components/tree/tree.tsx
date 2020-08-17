import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { TreeNode } from "./tree-node";
import useDimensions from "react-use-dimensions";

const ROW_HEIGHT = 20;

export const Tree: React.FC<{}> = observer(() => {
  const store = useStore();
  const {
    displayStartingIndex,
    displayContainerHeight,
    displayedTreePart,
    isLoading,
    isWrongFile,
    setScrollPosition,
    setViewportHeight,
  } = store;
  const [treeRef, { height }] = useDimensions();

  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    setViewportHeight(height);
  }, [height, setViewportHeight]);

  return (
    <div className="tree" ref={treeRef} onScroll={onScroll}>
      {isLoading && <span className="message">Loading ...</span>}
      {isWrongFile && <span className="message danger">File is not valid JSON file.</span>}
      <div className="tree-container" style={{ height: displayContainerHeight }}>
        {displayedTreePart.map((n, i) => (
          <TreeNode key={i} node={n} position={(i + displayStartingIndex) * ROW_HEIGHT} />
        ))}
      </div>
    </div>
  );
});
