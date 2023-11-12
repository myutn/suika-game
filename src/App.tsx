import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { suikaGame } from "./suikaGame";

export const App: React.FC = () => {
  return (
    <div className="App">
      <ReactP5Wrapper sketch={suikaGame}></ReactP5Wrapper>
    </div>
  );
};
