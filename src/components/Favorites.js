import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function Favorites() {
  const [allSug, setAllSug] = useState(null);
  const store = useTravelStore();

  useEffect(() => {
    async function getAllVotes() {
      let response = await fetch(`/suggestions/upvoted`);
      let data = await response.json();
      setAllSug(data);
    }
    getAllVotes();
  }, []);
  console.log(allSug);
  return (
    <div>
      <p> A list of all your voted places</p>
    </div>
  );
}

export default observer(Favorites);
