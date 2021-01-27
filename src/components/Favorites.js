import React, { useEffect, useState } from "react";
import VotesUpOrDown from "./VotesUpOrDown";

function Favorites() {
  const [allSug, setAllSug] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function getAllVotes() {
    try {
      let response = await fetch(`/suggestions/upvoted`);
      if (!response.ok) {
        console.log("backend error.");
      } else {
        let data = await response.json();
        setAllSug(data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getAllVotes();
  }, [isLoading]);

  return (
    <div>
      <h4> All your voted places:</h4>
      <div className="favorites-container">
        {isLoading ? null : ( // <div>Loading...</div>
          <>
            {allSug.map((s, index) => {
              return (
                <div key={index} className="suggestion-container">
                  <div>
                    <VotesUpOrDown suggestion={s} />
                  </div>
                  <div className="places-container">
                    {console.log(s.id)}
                    <a href={`/suggestion/${s.id}`}>{s.place.name}</a>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Favorites;
