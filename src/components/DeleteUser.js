import React, { useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { Redirect } from "react-router-dom";
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
  const { isShowing, toggle } = useModal();
  const store = useTravelStore();

  const handlesDeleteUser = async () => {
    let response = await fetch(`/users/${store.user?.user_id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      <Redirect to="/" />;
    }
  };
  return (
    <div>
      <span className="button-default" onClick={toggle}>
        <i className="fas fa-user-times fa-2x"></i>
        <p>Delete User</p>
      </span>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        onDelete={handlesDeleteUser}
        user={store.user?.username}
      />
    </div>
  );
}

export default observer(DeleteUser);
