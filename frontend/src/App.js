import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main>
            <Switch>
                <Redirect from="/" to="/auth" exact/>
                <Route path="/auth" Component={AuthPage} />
                <Route path="/events" Component={EventsPage} />
                <Route path="/bookings" Component={BookingsPage} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
