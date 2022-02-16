import React from 'react';
import {Button, Card, CardHeader, CardMedia, Checkbox, Divider, FormControlLabel, FormGroup, Grid, IconButton, Tooltip, Typography} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import 'react-image-crop/dist/ReactCrop.css';
import './RecommendedRecipes.css';
import axios from 'axios';

/**
 * Suggested Recipes component for ML-based recommendation of recipes
 */
class RecommendedRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    }
    this.queryStringify = this.queryStringify.bind(this);
    this.recipeList = this.recipeList.bind(this);
  }

  queryStringify(ingredient_list, include_panty_status) {
    let ingredient_string = ingredient_list.join(',+');
    let query_string = 'includePantry='.concat(include_panty_status.toString()).concat('&ingredients=').concat(ingredient_string);
    return query_string;
  }

  componentDidMount() {
    let query_string = this.queryStringify(this.props.query_ingredients, this.props.query_include_pantry);
    axios.get('http://127.0.0.1:5000/recsys?' + query_string)
    .then(response => {
      this.setState({recipes: response.data});
    })
    .catch(err => {
      console.log(err.response);
    });
  }

  recipeList() {
    return(
      <Grid container direction='column' padding={8} justifyContent='space-between' alignItems='flex-start'>
        {this.state.recipes.map(recipe => {
        return (
          <Grid item xs={2} key={recipe.title}>
            <Card className='recipe-card'>
              {/* <CardHeader className='recipe-header'
                action={
                  <IconButton onClick={event => this.handleDeleteFavorite(event)}>
                    <Clear />
                  </IconButton>
                }
              /> */}
              <Grid container spacing={2} direction='row' alignItems='flex-start'>
                <Grid item xs={3}>
                  <CardMedia
                    component='img'
                    className='recipe-thumbnail'
                    image={recipe.image}
                    onClick={this.handleOpenFavorite}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Grid container direction='column' alignItems='flex-start'>
                    <Grid>
                      <Typography variant='h5'>
                        {recipe.title}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant='subtitle2'>
                        Used Ingredients [{recipe.usedIngredientCount}]: {recipe.usedIngredient_names.join(', ')}
                      </Typography>
                      <Typography variant='subtitle2'>
                        Additional Ingredients [{recipe.missedIngredientCount}]: {recipe.missedIngredient_names.join(', ')}
                      </Typography>
                      <Typography variant='body2' dangerouslySetInnerHTML={{ __html: 'Summary: '.concat(recipe.summary) }}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>              
            </Card>
          </Grid>
        );
      })}
      </Grid>
    );
  }

  render() {
    if (this.state.recipes.length >= 1) {
      return (
        <div>
          <Typography id='rec-recipe-header' variant='h4'>
            Recommended Recipes
            <br/>
          </Typography>
          {this.recipeList()}
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default RecommendedRecipes;
