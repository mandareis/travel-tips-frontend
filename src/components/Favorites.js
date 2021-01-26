import React from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function Favorites() {
  const store = useTravelStore();

  const getAllVotedPlaces = () => {};

  return (
    <div>
      <p> A list of all your voted places</p>
    </div>
  );
}

export default observer(Favorites);
