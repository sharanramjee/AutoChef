import React from 'react';
import {Grid, Input, TextField, Typography} from '@material-ui/core';
import './loginRegister.css';
import axios from 'axios';

/**
 * Define loginRegister, a React componment of CS142 project #7
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_fail_message: '',
      login_username: '',
      login_password: '',
      register_fail_message: '',
      register_first_name: '',
      register_last_name: '',
      register_username: '',
      register_password: '',
      register_password_verify: '',
      register_location: '',
      register_description: '',
      register_occupation: '',
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
    
  handleLogin(event) {
    event.preventDefault();
    axios.post('admin/login', {
      login_name: this.state.login_username,
      password: this.state.login_password
    })
    .then(response => {
      this.setState({login_fail_message: ''});
      let user = response.data;
      this.props.changeLoggedIn(user);
      window.location.href = `#/users/${user._id}`;
    })
    .catch(err => {
      this.setState({login_fail_message: err.response.data});
    });
  }

  handleChangeInput(stateUpdate) {
    this.setState(stateUpdate);
  }

  handleRegister(event) {
    if(!this.state.register_first_name) {
      this.setState({register_fail_message: 'Please enter your first name'});
      return;
    }
    if(!this.state.register_last_name) {
      this.setState({register_fail_message: 'Please enter your last name'});
      return;
    }
    if(!this.state.register_username) {
      this.setState({register_fail_message: 'Please enter a username'});
      return;
    }
    if(!this.state.register_password) {
      this.setState({register_fail_message: 'Please enter a password'});
      return;
    }
    if (this.state.register_password != this.state.register_password_verify) {
      this.setState({register_fail_message: 'Passwords do not match'});
      return;
    }
    event.preventDefault();
    axios.post('/user', {
        login_name: this.state.register_username,
        password: this.state.register_password,
        first_name: this.state.register_first_name,
        last_name: this.state.register_last_name,
        location: this.state.register_location,
        description: this.state.register_description,
        occupation: this.state.register_occupation
      })
      .then(response => {
        console.log('Register response:', response);
        this.setState({
          login_fail_message: '',
          login_username: '',
          login_password: '',
          register_fail_message: '',
          register_first_name: '',
          register_last_name: '',
          register_username: '',
          register_password: '',
          register_password_verify: '',
          register_location: '',
          register_description: '',
          register_occupation: '',
        });
      })
      .catch(err => {
        this.setState({register_fail_message: err.response.data});
      });
  }

  render() {
    return (
      <Grid container justify='space-around'>
        <Grid item>
          <Typography variant='h5' color='inherit'>
            Login
          </Typography>
          <Typography variant='body1' color='error'>
            {this.state.login_fail_message}
          </Typography>
          <form onSubmit={this.handleLogin}>
            <label>
              <TextField
                required
                label='Username'
                type='text'
                value={this.state.login_username}
                onChange={event =>
                  this.handleChangeInput({login_username: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                required
                label='Password'
                type='password'
                value={this.state.login_password}
                onChange={event =>
                  this.handleChangeInput({login_password: event.target.value})
                }
              />
            </label>
            <br /><br />
            <Input type='submit' value='Submit' />
          </form>
        </Grid>

        <Grid item>
          <Typography variant='h5'>Register</Typography>
          <Typography variant='body1' color='error'>
            {this.state.register_fail_message}
          </Typography>
          <form onSubmit={this.handleRegister}>
            <label>
              <TextField
                required
                label='First name'
                type='text'
                value={this.state.register_first_name}
                onChange={event =>
                  this.handleChangeInput({register_first_name: event.target.value})
                }
              />{' '}
            </label>
            <br />
            <label>
              <TextField
                required
                label='Last name'
                type='text'
                value={this.state.register_last_name}
                onChange={event =>
                  this.handleChangeInput({register_last_name: event.target.value})
                }
              />{' '}
            </label>
            <br />
            <label>
              <TextField
                required
                label='Username'
                type='text'
                value={this.state.register_username}
                onChange={event =>
                  this.handleChangeInput({register_username: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                required
                label='Password'
                type='password'
                value={this.state.register_password}
                onChange={event =>
                  this.handleChangeInput({register_password: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                label='Verify password'
                required
                error={this.state.register_password != this.state.register_password_verify}
                type='password'
                value={this.state.register_password_verify}
                onChange={event =>
                  this.handleChangeInput({register_password_verify: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                label='Where are you from?'
                type='text'
                value={this.state.register_location}
                onChange={event =>
                  this.handleChangeInput({register_location: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                label='Describe yourself'
                type='text'
                value={this.state.register_description}
                onChange={event =>
                  this.handleChangeInput({register_description: event.target.value})
                }
              />
            </label>
            <br />
            <label>
              <TextField
                label='Occupation'
                type='text'
                value={this.state.register_occupation}
                onChange={event =>
                  this.handleChangeInput({register_occupation: event.target.value})
                }
              />
            </label>
            <br /><br />
            <Input type='submit' value='Register Me' />
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default LoginRegister;
