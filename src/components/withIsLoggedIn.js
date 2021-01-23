import React, { useEffect } from "react";
import { useTravelStore } from "../TipsContext";
import { useHistory } from "react-router-dom";

const useAuthentication = () => {
  const store = useTravelStore();
  const history = useHistory();
  useEffect(() => {
    if (store.user) {
      // logic to hide home
    }
  }, [history, store.user]);
};

function withIsLoggedIn(Component) {
  return (props) => {
    useAuthentication();
    return <Component {...props} />;
  };
}
export { withIsLoggedIn };
