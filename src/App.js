import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Content from "./components/Content";

function App() {
  return (
    <div className="App">
      <div className="container site-main-outer">
        <Router>
          <Switch>
            <Route exact path="/">
              <div className="container site-main-inner">
                <div className="row">
                  <div className="col-4 col-sm-12 col-md-4 col-lg-4">
                    <Register />
                  </div>
                </div>
              </div>
            </Route>
            <Route path="/login">
              <div className="container site-main-inner">
                <div className="row">
                  <div className="col-4 col-sm-12 col-md-4 col-lg-4 login">
                    <Login />
                  </div>
                </div>
              </div>
            </Route>
            <Route>
              <div className="row justify-content-center">
                <div className="row">
                  <Content />
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div id="footer">
              <a
                className="footer-colors"
                href="https://www.linkedin.com/in/amanda-depaula-reis/"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fab fa-linkedin"></i>
                &nbsp; LinkedIn
              </a>
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
    </div>
  );
}

export default App;
