import React, { useEffect, useState } from "react";

function VotesUpOrDown(props) {
  const [direction, setDirection] = useState(0);
  const [votes, setVotes] = useState(0);

  // needs to warn user he must to sign up to vote

  useEffect(() => {
    async function fetchDirection() {
      if (props.suggestion?.id) {
        let response = await fetch(`/suggestions/${props.suggestion?.id}/vote`);
        if (response.ok) {
          let data = await response.json();
          if (data !== null) {
            setDirection(data.direction);
          }
        }
      }
    }
    fetchDirection();
  }, [props.suggestion?.id]);

  let handlesVote = (desiredDirection) => {
    return async () => {
      if (desiredDirection === direction) {
        await fetch(`/suggestions/${props.suggestion?.id}/vote`, {
          method: "DELETE",
        });
        setDirection(0);
        return;
      }
      let response = await fetch(`/suggestions/${props.suggestion?.id}/vote`, {
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

  useEffect(() => {
    let getAmountOfVotes = async () => {
      let response = await fetch(
        `/suggestions/${props.suggestion?.id}/get_votes`
      );
      let data = await response.json();
      setVotes(data);
    };
    getAmountOfVotes();
  }, []);

  return (
    <div className="votes-container">
      <button
        className={`button-up ${direction === 1 ? "active" : ""}`}
        onClick={doUpvote}
      >
        <i className="fas fa-arrow-alt-circle-up"></i>
      </button>
      <span>{votes}</span>
      <button
        className={`button-down ${direction === -1 ? "active" : ""}`}
        onClick={doDownvote}
      >
        <i className="fas fa-arrow-alt-circle-down "></i>
      </button>
    </div>
  );
}

export default VotesUpOrDown;
