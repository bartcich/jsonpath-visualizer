import React, { useRef, useEffect, useState } from "react";
import cls from "classnames";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";

let dragCounter = 0;

const prevDefault = (e: DragEvent | React.DragEvent<Element>): void => {
  e.preventDefault();
  e.stopPropagation();
};

const isProperFile = (e: DragEvent | React.DragEvent<Element>): boolean => {
  return e.dataTransfer.items && e.dataTransfer.items.length === 1 && e.dataTransfer.items[0].kind === "file";
};

export const FileInput: React.FC<{}> = observer(() => {
  const store = useStore();
  const [dragging, setDragging] = useState(false);
  const fileuploadRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const dragEnter = (e: DragEvent): void => {
      prevDefault(e);
      if (isProperFile(e)) {
        dragCounter++;
        setDragging(true);
      }
    };

    const dragExit = (e: DragEvent): void => {
      prevDefault(e);
      dragCounter--;
      if (dragCounter < 1) {
        setDragging(false);
      }
    };

    const dragOver = (e: DragEvent): void => {
      prevDefault(e);
    };
    window.addEventListener("dragenter", dragEnter);
    window.addEventListener("dragleave", dragExit);
    window.addEventListener("dragover", dragOver);

    return () => {
      window.removeEventListener("dragenter", dragEnter);
      window.removeEventListener("dragexit", dragExit);
    };
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      store.importJson(await file.text());
    }
  };

  const handleDrop: React.DragEventHandler = async (e) => {
    prevDefault(e);
    if (!isProperFile(e)) {
      return;
    }
    setDragging(false);
    const file = e.dataTransfer.items[0].getAsFile();
    store.importJson(await file.text());
  };

  const classes = cls("file-drop", { dragging });

  return (
    <label className={classes} onDrop={handleDrop}>
      <div className="fullscreen-drop">Drop file here</div>
      <button onClick={() => fileuploadRef.current.click()}>Open file</button> or drop anywhere
      <input ref={fileuploadRef} type="file" onChange={handleChange} />
    </label>
  );
});
