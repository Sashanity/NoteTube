import React, {Component} from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import "./App.css"
import Navbar from "./components/Layout/navbar"
import Footer from "./components/Layout/footer"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Homepage from "./components/pages/Homepage"
import Landing from "./components/pages/Landing"

//This is the app
class App extends Component {
  render() {
    if (localStorage.getItem("token")){
      return (
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/homepage" component={Homepage} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
            <Footer></Footer>
          </div>
        </Router>
      )
    }
    else{
      return (
        <Router>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/homepage" component={Homepage} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </Router>
      )
    }
  }
}

export default App