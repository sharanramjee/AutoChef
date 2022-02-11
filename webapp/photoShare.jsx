import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Grid, Paper} from '@material-ui/core';
import './styles/main.css';
import axios from 'axios';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import LoginRegister from './components/LoginRegister/LoginRegister';
import Favorites from './components/favorites/Favorites';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Home',
      isLoggedIn: true,
      login_name: undefined,
      current_user: undefined,
      upload_clicked: false,
    }
    this.changeView = this.changeView.bind(this);
    this.changeLoggedIn = this.changeLoggedIn.bind(this);
    this.changeUpload = this.changeUpload.bind(this);
  }

  componentDidMount() {
    axios.get('/admin/current')
    .then(response => {
      let user = response.data;
      this.setState({current_user: user});
    })
    .catch(() => {
      this.setState({current_user: undefined});
    });
  }

  changeView(newView) {
    this.setState({view: newView});
  }

  changeLoggedIn(newUser) {
    if (!newUser){
      axios.post('/admin/logout', {})
      .then(() => {
        this.props.changeLoggedIn(undefined);
      })
      .catch(err => console.log(err.response));
    }
    this.setState({current_user: newUser});
  }

  changeUpload(newClick) {
    this.setState({upload_clicked: newClick});
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar view={this.state.view} current_user={this.state.current_user} changeView={this.changeView}
          changeLoggedIn={this.changeLoggedIn} changeUpload={this.changeUpload} upload_clicked={this.state.upload_clicked}/>
        </Grid>
        <div className='cs142-main-topbar-buffer'/>
        <Grid item sm={3}>
          <Paper className='cs142-main-grid-item'>
            {this.state.current_user ? <UserList /> : null}
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className='cs142-main-grid-item'>
            <Switch>
              {this.state.current_user ? (
                <Redirect path='/login-register' to={`/users/${this.state.current_user._id}`} />
              ) : (
                <Route exact path='/login-register'
                render={props => <LoginRegister {...props} changeLoggedIn={this.changeLoggedIn} /> }
                />
              )}
              {this.state.current_user ? (
                <Route path='/favorites'
                render={props => <Favorites {...props} /> }
                />
              ) : (
                <Redirect path='/favorites' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Route path='/users/:userId'
                  render={props => <UserDetail {...props} curr_user_id={this.state.current_user._id} changeView={this.changeView} /> }
                />
              ) : (
                <Redirect path='/users/:userId' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Route path='/photos/:userId'
                  render={props => <UserPhotos changeView={this.changeView} changeUpload={this.changeUpload}
                  upload_clicked={this.state.upload_clicked} curr_user_id={this.state.current_user._id} {...props} /> }
                />
              ) : (
                <Redirect path='/photos/:userId' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Redirect path='/' to={`/users/${this.state.current_user._id}`} />
              ) : (
                <Redirect path='/' to='/login-register' />
              )}
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
    </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
