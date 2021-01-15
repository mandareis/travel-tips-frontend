import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Settings from "./components/Settings";
import NavBar from "./components/NavBar";
import UpdateUser from "./components/UpdateUser";
import SuggestionsPage from "./components/SuggestionsPage";
// import { autorun } from "mobx";

const PageContainer = ({ children }) => {
  return (
    <div className="container">
      <div className="row ">
        <div className="col">
          <NavBar />
        </div>
      </div>
      <div className="row">
        <div className="col">
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
              <Register />
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
          <Route path="/edituser">
            <PageContainer>
              <UpdateUser />
            </PageContainer>
          </Route>
          <Route path="/suggestions">
            <PageContainer>
              <SuggestionsPage />
            </PageContainer>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
