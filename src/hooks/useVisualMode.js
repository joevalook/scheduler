import { useState } from "react";


export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  console.log(history);
  function transition(second, replace = false) {
    if (replace) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1), second]);
      setMode(second);
    }
    else {
      setMode(second);
      setHistory([...history, second]);
    }
  }
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
    }

  }

  return { mode, transition, back };
};
