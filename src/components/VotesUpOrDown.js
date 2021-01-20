import React, { useEffect, useState } from "react";
import { useTravelStore } from "../TipsContext";
import { observer } from "mobx-react";

function VotesUpOrDown() {
  let store = useTravelStore();
  const [direction, setDirection] = useState(0);

  // needs to display amount of votes
  // change button color like reddit?
  // needs to warn user he must to sign up to vote

  useEffect(() => {
    async function fetchDirection() {
      if (store.suggestion?.id) {
        let response = await fetch(`/suggestions/${store.suggestion?.id}/vote`);
        if (response.ok) {
          let data = await response.json();
          if (data !== null) {
            setDirection(data.direction);
          }
        }
      }
    }
    fetchDirection();
  }, [store.suggestion?.id]);
  let handlesVote = (desiredDirection) => {
    return async () => {
      if (desiredDirection === direction) {
        await fetch(`/suggestions/${store.suggestion?.id}/vote`, {
          method: "DELETE",
        });
        setDirection(0);
        return;
      }
      let response = await fetch(`/suggestions/${store.suggestion?.id}/vote`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          direction: desiredDirection,
        }),
      });
      let data = await response.json();
      setDirection(data.direction);
    };
  };

  let doUpvote = handlesVote(+1);
  let doDownvote = handlesVote(-1);

  return (
    <div className="votes-container">
      <button
        className={`button-up ${direction === 1 ? "active" : ""}`}
        onClick={doUpvote}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      <span># of votes</span>
      <button
        className={`button-down ${direction === -1 ? "active" : ""}`}
        onClick={doDownvote}
      >
        <i className="fas fa-arrow-down "></i>
      </button>
    </div>
  );
}

export default observer(VotesUpOrDown);