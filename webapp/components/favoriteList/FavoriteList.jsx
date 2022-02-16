import React from 'react';
import {Divider, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import './FavoriteList.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

/**
 * FavoriteList component for list of favorited recipes
 */
class FavoriteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
    }
  }

  componentDidMount() {
    axios.get('/getFavorites')
    .then(response => {
      let favorite_list = response.data;
      favorite_list.sort(function(a, b){
        return a.date_time - b.date_time;
      });
      this.setState({favorites: favorite_list});
    })
    .catch(err => {
      console.log(err.response);
    })
    // axios.get('https://api.spoonacular.com/recipes/findByIngredients?apiKey=8ed35011298e4cd5b31f57c78d4b9055&ingredients=apples,+flour,+sugar&number=2')
    // .then(response => {
    //   console.log('Spoonacular response:', response.data);
    // })
    // .catch(err => {
    //   console.log('Spoonacular error:', err);
    // });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updateFavoritesStatus !== this.props.updateFavoritesStatus) {
      axios.get('/getFavorites')
      .then(response => {
        let favorite_list = response.data;
        favorite_list.sort(function(a, b){
          return a.date_time - b.date_time;
        });
        this.setState({favorites: favorite_list});
        this.props.updateFavorites(false);
      })
      .catch(err => {
        console.log(err.response);
      })
    }
  }

  render() {
    if (this.state.favorites) {
      let favoriteList = [];
      for(let i = 0; i < this.state.favorites.length; i++){
        favoriteList.push(
          <div key = {i}>
            <ListItem button component={Link} to={'/favorites/' + this.state.favorites[i].id}>
              <ListItemText className='favorite-recipe' primary={this.state.favorites[i].title}/>
            </ListItem>
            <Divider />
          </div>
        );
      }
      return (
        <div className='favoriteList-container'>
          <Typography variant='h5'>
            Favorite Recipes
          </Typography>
          <List component='nav'>
          <Divider/>
            {favoriteList}
          </List>
        </div>
      )
    }
    else {
      return (<div/>); 
    }
  }
}

export default FavoriteList;
