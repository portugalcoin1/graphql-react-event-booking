import React, { Component } from 'react';

// Importar o css da pagina auth.js
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  static contextType = AuthContext;

  // Construtor para comunicar com o backend
  // Devemos ter outro terminal aberto com o backend a correr
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(preState => {
      return {isLogin: !preState.isLogin};
    })
  }

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    // validação dos dados
    if (email.trim().length === 0 || password.trim().length ===0) {
      return; // não continua
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}"){
            userId
            token
          }
        }
      `
    }

    if (!this.state.isLogin) {
      // Inserção de dados na BD fazendo query GraphQL vindo do Front-End
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }

    // enviar um http rquest
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    }).then(resData => {
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token, 
          resData.data.login.userId
        );
      }
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl}></input> 
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
         <button type="submit">Submit</button>
    <button type="button" onClick={this.switchModeHandler}>Switch {this.state.isLogin ? 'Sign Up' : 'Login'}</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;