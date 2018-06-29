import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../components/common/history';

import App from '../components/common/App';
import Login from '../components/common/Login';
import Home from '../components/common/Home';
import NoMatch from '../components/common/404';
import Form from '../components/form/Form';

class MRoute extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/eos_web_manage" component={Home}/>
          <Route exact path="/eos_web_manage/form" component={Form}/>
          <Route path="/eos_web_manage/login" component={Login}/>
          <Route component={NoMatch}/>
        </Switch>
      </Router>
    );
  }
}

export default MRoute;