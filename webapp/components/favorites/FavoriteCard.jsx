import React from 'react';
import {Card, CardHeader, CardMedia, Dialog, DialogContent, DialogTitle, IconButton} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import './FavoriteCard.css';
import axios from 'axios';

/**
 * Define FavoriteCard, a React componment of CS142 project #8
 */
class FavoriteCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_view: false,
    };
    this.handleOpenFavorite = this.handleOpenFavorite.bind(this);
    this.handleCloseFavorite = this.handleCloseFavorite.bind(this);
    this.handleDeleteFavorite = this.handleDeleteFavorite.bind(this);
  }

  handleOpenFavorite() {
    this.setState({modal_view: true});
  }

  handleCloseFavorite() {
    this.setState({modal_view: false});
  }

  handleDeleteFavorite(event) {
    event.preventDefault();
    axios.get('/removeFavorite/' + this.props.photo._id)
    .then(() => {
      this.props.updateFavorites();
    })
    .catch(err => {
      console.log('Delete favorite error:', err.response);
    });
  }

  render() {
    return (
      <div>
        <Card className='favorite-card'>
          <CardHeader className='favorite-header'
            action={
              <IconButton onClick={event => this.handleDeleteFavorite(event)}>
                <Clear />
              </IconButton>
            }
          />
          <CardMedia
            component='img'
            className='favorite-thumbnail'
            image={'/images/' + this.props.photo.file_name}
            onClick={this.handleOpenFavorite}
          />
        </Card>
        <Dialog onClose={this.handleCloseFavorite} aria-labelledby='customized-dialog-title' open={this.state.modal_view}>
          <DialogTitle className='favorite-title' onClose={this.handleCloseFavorite}>
            {this.props.photo.date_time}
          </DialogTitle>
          <DialogContent>
            <img className='favorite-photo' src={'/images/' + this.props.photo.file_name} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default FavoriteCard;