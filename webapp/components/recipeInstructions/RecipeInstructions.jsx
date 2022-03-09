import React from 'react';
import {Button, Divider, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import './RecipeInstructions.css';
import axios from 'axios';

/**
 * Recipe Instructions component for displaying step-by-step recipe instructions
 */
class RecipeInstructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe_id: this.props.match.params.recipe_id,
      instructions: undefined,
    }
    this.queryStringify = this.queryStringify.bind(this);
    this.instructionsList = this.instructionsList.bind(this);
  }

  queryStringify(breakdown, recipe_id) {
    let query_string = 'breakdown='.concat(breakdown.toString()).concat('&recipe_id=').concat(recipe_id);
    return query_string;
  }

  componentDidMount() {
    // Get detailed instructions
    // this.setState({recipe_id: this.props.match.params.recipe_id});
    let query_string = this.queryStringify(true, this.props.match.params.recipe_id);
    axios.get('http://127.0.0.1:5000/insts?' + query_string)
    .then(response => {
      this.setState({instructions: response.data[0].instructions[0].steps});
    })
    .catch(err => {
      console.log(err.response);
    });
  }

  componentDidUpdate(prevProps) {
    // Get detailed instructions
    if(prevProps !== this.props){
      let query_string = this.queryStringify(true, this.props.match.params.recipe_id);
      axios.get('http://127.0.0.1:5000/insts?' + query_string)
      .then(response => {
        this.setState({instructions: response.data[0].instructions[0].steps});
      })
      .catch(err => {
        console.log(err.response);
      });
    }
  }

  instructionsList() {
    let instructions_list = [];
    for(let i = 0; i < this.state.instructions.length; i++){
      instructions_list.push(
        <div key = {i}>
          <ListItem>
            <ListItemText className='recipe-step' primary={(i+1).toString() + '. ' + this.state.instructions[i].step}/>
          </ListItem>
          {/* <Divider /> */}
        </div>
      );
    }
    return instructions_list;
  }

  render() {
    if (this.state.instructions) {
      return (
        <div>
          <Typography variant='h2'>
            Instructions:
            <br/>
          </Typography>
          <List component='recipe-steps'>
            <Divider/>
            {this.instructionsList()}
          </List>
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default RecipeInstructions;
