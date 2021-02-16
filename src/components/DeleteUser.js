import React, { useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import { runInAction } from "mobx";
import { withIsLoggedOut } from "./withIsLoggedOut";

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

const Modal = ({ isShowing, hide, onDelete, user }) =>
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
              <div className="inner-modal"> </div>
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
              <h4>Delete {user}'s Account</h4>
              <p> Are you sure you would like to delete this account?</p>
              <div className="delete-account-btns">
                <button type="button" id="no-btn" onClick={hide}>
                  No
                </button>
                <button id="yes-btn" onClick={onDelete}>
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

function DeleteUser() {
  let history = useHistory();
  const { isShowing, toggle } = useModal();
  const store = useTravelStore();

  const handlesDeleteUser = async () => {
    let response = await fetch(`/users`, {
      method: "DELETE",
    });
    console.log(response);
    if (!response.ok) {
      console.log("Something is not right");
    } else {
      runInAction(() => {
        store.user = null;
        store.successfullyDeletedUser = true;
      });
      toggle();
      history.push("/");
    }
  };
  return (
    <div className="delete-container">
      <div className="button-default" onClick={toggle}>
        <i className="fas fa-user-times fa-2x user-delete"></i>
        <p>Delete User</p>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        onDelete={handlesDeleteUser}
        user={store.user?.username}
      />
    </div>
  );
}

export default withIsLoggedOut(observer(DeleteUser));
