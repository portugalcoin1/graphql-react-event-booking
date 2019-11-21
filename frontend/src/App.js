import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth'; // Página de Autenticação
import BookingsPage from './pages/Bookings'; // Página de Agendamentos
import EventsPage from './pages/Events'; // Página de Eventos
import MainNavigation from './components/Navigation/MainNavigation'; // Header Naviagtion
import AuthContext from './context/auth-context'; // Guardar em cache valores

import './App.css';

class App extends Component {
  // inicializar o objecto STATE
  state = {
    token: null,
    userId: null 
  }

  login = (token, userId) => {
    this.setState({ token: token, userId: userId });
  };

  // Reset do user para logout
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  
  // this.state.token -> Verifica se o user eá logado. Enquanto tiver token está logado
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider 
            value={{ 
              token: this.state.token, 
              userId: this.state.userId, 
              login: this.login, 
              logout: this.logout 
            }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                 <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token &&( 
                  <Route path="/auth" component={AuthPage} />
                )}
                  <Route path="/events" component={EventsPage} />
                {this.state.token && ( 
                  <Route path="/bookings" component={BookingsPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;