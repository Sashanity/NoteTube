import React, {Component} from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import "./App.css"
import Navbar from "./components/Layout/navbar"
import Footer from "./components/Layout/footer"
import landing from "./pages/Landing"
//This is the app
class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={landing} />
          </Switch>
          <Footer></Footer>
        </div>
      </Router>
    )
  }
}

export default App