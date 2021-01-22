import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Settings from "./components/Settings";
import NavBar from "./components/NavBar";
import UpdateUser from "./components/UpdateUser";
import SuggestionsPage from "./components/SuggestionsPage";
import DisplaySuggestion from "./components/DisplaySuggestion";
import ChangePassword from "./components/ChangePassword";
import SuggestionForm from "./components/SuggestionForm";
import Favorites from "./components/Favorites";
import { observer } from "mobx-react";
import { useTravelStore } from "./TipsContext";
import { runInAction } from "mobx";

const PageContainer = ({ children }) => {
  let history = useHistory();
  const store = useTravelStore();
  // const [message, setMessage] = useState("");
  const onLogOut = async () => {
    const response = await fetch("/sessions", {
      method: "DELETE",
    });
    if (response.ok) {
      runInAction(() => {
        store.user = null;
      });
      history.push("/");
      // setMessage("You've successfully logged out!");
      alert("Successfully logged out!");
    }
  };
  return (
    <div className="container">
      <div className="row ">
        <div className="app-title">
          <h2>ExploreTravel.tips</h2>
        </div>
        <div className="col">
          <NavBar onLogOut={onLogOut} />
        </div>
      </div>
      <div className="row ">
        <div className="col ">
          <div className="site-main-outer">
            <div className="site-main-inner">{children}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div id="footer">
            <a
              className="footer-colors"
              href="https://github.com/mandareis"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fab fa-github"></i>
              &nbsp; GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <PageContainer>
              <Register></Register>
              {/* {store.user ? <p>{message}</p> : null} */}
            </PageContainer>
          </Route>
          <Route path="/login">
            <PageContainer>
              <Login />
            </PageContainer>
          </Route>
          <Route path="/settings">
            <PageContainer>
              <Settings />
            </PageContainer>
          </Route>
          <Route path="/edit-user">
            <PageContainer>
              <UpdateUser />
            </PageContainer>
          </Route>
          <Route
            path="/suggestions"
            render={(routeProps) => (
              <PageContainer>
                <SuggestionsPage {...routeProps} />
              </PageContainer>
            )}
          ></Route>
          <Route path="/change-password">
            <PageContainer>
              <ChangePassword />
            </PageContainer>
          </Route>
          <Route path="/add-suggestion">
            <PageContainer>
              <SuggestionForm />
            </PageContainer>
          </Route>
          <Route
            path="/suggestion/:id"
            render={(routeProps) => (
              <PageContainer>
                <DisplaySuggestion params={routeProps.match.params} />
              </PageContainer>
            )}
          />
          <Route path="/favorites">
            <PageContainer>
              <Favorites />
            </PageContainer>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default observer(App);
