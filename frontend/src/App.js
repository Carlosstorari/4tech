import React from 'react';
import './App.css';
import Login from './components/containers/login/Login'
import Timeline from './components/containers/Timeline/Timeline';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

function App() {
  
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute  path="/timeline" component={Timeline} />
        <Redirect to="/"/>
      </Switch>
    </Router>
  );
}

export default App;
