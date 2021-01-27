import React, { useEffect, useState } from "react";
import { useTravelStore } from "../TipsContext";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  };
};

const Modal = ({ isShowing, hide, user, handlesLogin, handlesRegister }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <div className="modal-header">
                <button
                  type="button"
                  id="x-btn"
                  className="modal-close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  <i className="fas fa-window-close"></i>
                </button>
              </div>
              <div className="inner-modal">
                <i className="fas fa-exclamation-triangle fa-3x"></i>
              </div>
              <h4>You must be logged in to vote.</h4>

              <div className="delete-account-btns">
                <button type="button" id="no-btn" onClick={handlesLogin}>
                  Login
                </button>
                <button id="yes-btn" onClick={handlesRegister}>
                  Register
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

function VotesUpOrDown(props) {
  const [direction, setDirection] = useState(0);
  const [votes, setVotes] = useState(0);
  const store = useTravelStore();
  let history = useHistory();
  const { isShowing, toggle } = useModal();
  // needs to warn user they must to sign up to vote

  function handlesLogin() {
    history.push("/login");
  }
  function handlesRegister() {
    history.push("/register");
  }

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
      if (!store.user) {
        toggle();
        return;
      }
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
  }, [direction, props.suggestion?.id, setVotes]);

  return (
    <div className="votes-container">
      <Modal
        isShowing={isShowing}
        hide={toggle}
        user={store?.user}
        handlesLogin={handlesLogin}
        handlesRegister={handlesRegister}
      />
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

export default observer(VotesUpOrDown);
