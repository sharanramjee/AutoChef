import React from 'react';
import {AppBar, Button, Checkbox, Dialog, FormControlLabel, FormGroup, FormLabel, Grid, Input, ListItem, ListItemText, Toolbar, Typography} from '@material-ui/core';
import './TopBar.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

/**
 * TopBar of the webapp
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      upload_dialog_open: false,
      permissions_box: false,
      permitted_users: {},
      unpermitted_users: {},
    }
    this.handleHomeButtonClicked = this.handleHomeButtonClicked.bind(this);
    this.handleLogoutButtonClicked = this.handleLogoutButtonClicked.bind(this);
    this.handleFavoriteButtonClicked = this.handleFavoriteButtonClicked.bind(this);
    this.handleUploadDialogOpened = this.handleUploadDialogOpened.bind(this);
    this.handleUploadDialogClosed = this.handleUploadDialogClosed.bind(this);
    this.handleUploadButtonClicked = this.handleUploadButtonClicked.bind(this);
    this.handleChangePermissions = this.handleChangePermissions.bind(this);
  }

  componentDidMount() {
    axios.get('/unpermittedUsers/list')
    .then(response => {
      this.setState({unpermitted_users: response.data});
    })
    .catch(err => {
      console.log('unpermittedUsers get error:', err.response);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view) {
      this.setState({view: this.props.view});
    }
    if (prevProps.current_user !== this.props.current_user) {
      axios.get('/unpermittedUsers/list')
      .then(response => {
        this.setState({
          permissions_box: false,
          permitted_users: {},
          unpermitted_users: response.data
        });
      })
      .catch(err => {
        console.log('unpermittedUsers error:', err.response);
      });
    }
  }

  handleHomeButtonClicked() {
    this.setState({view: 'Home'});
  }

  handleLogoutButtonClicked() {
    this.props.changeLoggedIn(undefined);
  }

  handleFavoriteButtonClicked() {
    this.setState({view: 'Your favorites'});
  }

  handleUploadDialogOpened() {
    this.setState({upload_dialog_open: true});
  }
  
  handleUploadDialogClosed() {
    this.setState({upload_dialog_open: false});
  }

  handleUploadButtonClicked(event) {
    event.preventDefault();
    let all_users = {};
    for (let user of this.state.unpermitted_users) {
      all_users[user['_id']] = true;
    }
    if (!this.state.permissions_box) {
      this.setState({
        permitted_users: this.state.unpermitted_users.map(({_id}) => {
          return {[_id]: true};
        })
      });
    }
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      if (!this.state.permissions_box) {
        domForm.append('usersPermissed', JSON.stringify(all_users));
      }
      else {
        domForm.append('usersPermissed', JSON.stringify(this.state.permitted_users));
      }
      axios.post('/photos/new', domForm)
      .then(() => {
        this.setState({
          upload_dialog_open: false,
          permissions_box: false,
          permitted_users: {}
        });
      })
      .catch(err => {
        console.log('Photo upload error:', err);
      });
    }
  }

  handleChangePermissions() {
    this.setState({permissions_box: !this.state.permissions_box});
  }

  handleChangeFriendPermissions = user_id => () => {
    let {permitted_users} = this.state;
    permitted_users[user_id] = !permitted_users[user_id];
    this.setState({permitted_users});
  }

  render() {
    return (
      <AppBar className='topbar-appbar' position='absolute'>
        <Toolbar>
          {this.props.current_user ? (
            <Grid container direction='row' justify='space-between' alignItems='center'>
              <div>
                <ListItem button onClick={this.handleHomeButtonClicked} component={Link} to={'/'} >
                  <ListItemText primary={'AutoChef'} />
                </ListItem>
              </div>
              <Typography variant='h5' align='right'>
                  Hi {this.props.current_user.first_name}
              </Typography>
              <Typography variant='h5' align='right'>
                  {this.state.view}
              </Typography>
              
              <Grid item>
                <Link to='/favorites'>
                  <Button variant='contained' onClick={this.handleFavoriteButtonClicked}>
                    Favorites
                  </Button>
                </Link>
              </Grid>
              
              <Grid item>
                <Button variant='contained' color='primary' onClick={this.handleUploadDialogOpened}>
                  Upload Photo
                </Button>
                <Dialog open={this.state.upload_dialog_open} onClose={this.handleUploadDialogClosed}>
                  <form onSubmit={this.handleUploadButtonClicked}>
                    <FormLabel>
                      <input
                        type='file'
                        accept='image/*'
                        ref={domFileRef => {this.uploadInput = domFileRef}}
                      />
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.permissions_box} onChange={this.handleChangePermissions}/>}
                        label='Specify permissions'
                      />
                    </FormGroup>
                    {this.state.permissions_box && (
                      <div>
                        <FormLabel>
                          Choose who can view:
                        </FormLabel>
                        <FormGroup>
                          {this.state.unpermitted_users && this.state.unpermitted_users.map(user => {
                            return (
                              <FormControlLabel
                                key={user._id}
                                control={
                                  <Checkbox
                                    checked={this.state.permitted_users[user._id]}
                                    onChange={this.handleChangeFriendPermissions(user._id)}
                                    value={user._id}
                                  />
                                }
                                label={user.first_name + ' ' + user.last_name}
                              />
                            );
                          })}
                        </FormGroup>
                      </div>
                    )}
                    <Input color='primary' type='submit' value='Post' />
                  </form>
                </Dialog>
              </Grid>

              <Grid item>
                <Button variant='contained' onClick={this.handleLogoutButtonClicked}>
                  Log out
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction='row' justify='space-between' alignItems='center'>
              <div>
                <ListItem button onClick={this.handleHomeButtonClicked} component={Link} to={'/'} >
                  <ListItemText primary={'AutoChef'} />
                </ListItem>
              </div>
              <Typography variant='h5'>Please login</Typography>
            </Grid>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
