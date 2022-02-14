import React from 'react';
import {AppBar, Button, Dialog, FormControlLabel, FormGroup, FormLabel, Grid, Input, ListItem, ListItemText, Toolbar, Typography} from '@material-ui/core';
import './TopBar.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

/**
 * TopBar component for home, upload photo, and log out buttons
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upload_dialog_open: false,
    }
    // Logout Button
    this.handleLogoutButtonClicked = this.handleLogoutButtonClicked.bind(this);
    // Upload Photo Button
    this.handleUploadDialogOpened = this.handleUploadDialogOpened.bind(this);
    this.handleUploadDialogClosed = this.handleUploadDialogClosed.bind(this);
    this.handleUploadButtonClicked = this.handleUploadButtonClicked.bind(this);
  }

  handleLogoutButtonClicked() {
    this.props.changeLoggedIn(undefined);
  }

  handleUploadDialogOpened() {
    this.setState({upload_dialog_open: true});
  }
  
  handleUploadDialogClosed() {
    this.setState({upload_dialog_open: false});
  }

  handleUploadButtonClicked(event) {
    event.preventDefault();
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/photos/new', domForm)
      .then(() => {
        this.setState({
          upload_dialog_open: false
        });
        window.location.href = '#/ingredient-selector';
      })
      .catch(err => {
        console.log('Photo upload error:', err);
      });
    }
  }

  render() {
    return (
      <AppBar className='topbar-appbar' position='absolute'>
        <Toolbar>
          {this.props.current_user ? (
            <Grid container direction='row' justifyContent='space-between'>
              <Grid item>
                <Grid container direction='row' justifyContent='flex-start'>
                  <Typography id='home-button' variant='h4' component={Link} to={'/'}>
                    AutoChef
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction='row' justifyContent='flex-end'>
                  <Grid item id='upload-button'>
                    <Button variant='contained' color='primary' onClick={this.handleUploadDialogOpened} >
                      Upload Photo
                    </Button>
                    <Dialog open={this.state.upload_dialog_open} onClose={this.handleUploadDialogClosed}>
                      <form onSubmit={this.handleUploadButtonClicked}>
                        <FormLabel>
                          <input type='file' accept='image/*' ref={domFileRef => {this.uploadInput = domFileRef}}/>
                        </FormLabel>
                        <Input color='primary' type='submit' value='Upload' />
                      </form>
                    </Dialog>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' onClick={this.handleLogoutButtonClicked}>
                      Log out
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction='row' justifyContent='space-between' alignItems='center'>
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
