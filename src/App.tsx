import React from "react";
import "./App.scss";
import GameBoard from "./components/GameBoard";
import TurnIndicator from "./components/TurnIndicator";
import Description from "./components/Description";
import Header from "./components/Header";
import ActionMenu from "./components/ActionMenu";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <TurnIndicator />
        <Description />
      </div>
      <ActionMenu />
      <GameBoard />
    </div>
  );
};

export default App;
