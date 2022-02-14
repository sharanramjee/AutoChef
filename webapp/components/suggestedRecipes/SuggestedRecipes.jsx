import React from 'react';
import {Button, Card, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Tooltip, Typography} from '@material-ui/core';
import 'react-image-crop/dist/ReactCrop.css';
import './SuggestedRecipes.css';
import axios from 'axios';

/**
 * Suggested Recipes component for ML-based recommendation of recipes
 */
class RecipeSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    }
    this.query_stringify = this.query_stringify.bind(this);
  }

  query_stringify(ingredient_list, include_panty_status) {
    let ingredient_string = ingredient_list.join(',+');
    let query_string = 'includePantry='.concat(include_panty_status.toString()).concat('&ingredients=').concat(ingredient_string);
    return query_string;
  }

  componentDidMount() {
    let query_string = this.query_stringify(this.props.query_ingredients, this.props.query_include_pantry);
    console.log(query_string);
    axios.get('/suggested-recipes/' + query_string)
    .then(response => {

    })
    .catch(err => {
      console.log(err.response);
    });
    // Hard-code some detected ingredients
    let detected_example = {'apple': true, 'flour': true, 'sugar': true};
    this.setState({detected_ingredients: detected_example});
  }

  render() {
    if (this.state.photo) {
      return (
        <div>
          <Typography variant='h4'>
            Uploaded Photo
            <br/>
          </Typography>
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default RecipeSuggestions;
