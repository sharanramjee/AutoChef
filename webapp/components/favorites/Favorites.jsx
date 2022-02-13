import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import FavoriteCard from './FavoriteCard';
import axios from 'axios';

/**
 * Define Favorites, a React componment of CS142 project #8
 */
class Favorites extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      favorites: [],
    };
    this.updateFavorites = this.updateFavorites.bind(this);
    this.updateFavorites();
  }

  updateFavorites() {
    axios.get('/getFavorites')
    .then(response => {
      this.setState({favorites: response.data});
    })
    .catch(err => {
      console.log('getFavorites error:', err);
      this.setState({favorites: []});
      
    });
  }

  render() {
    return (
      <Grid container justifyContent='space-evenly' alignItems='flex-start'>
        {this.state.favorites.length > 0 ? (
          this.state.favorites.map(photo => (
          <Grid item xs={2} key={photo.file_name}>
            <FavoriteCard updateFavorites={this.updateFavorites} photo={photo} />
          </Grid>
          ))
        ) : (
          <Typography variant='h5'>
            Nothing favorited yet
          </Typography>
        )}
      </Grid>
    );
  }
}

export default Favorites;