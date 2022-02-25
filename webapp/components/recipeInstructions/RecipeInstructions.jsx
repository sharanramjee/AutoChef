import React from 'react';
import {Button, Divider, Typography} from '@material-ui/core';
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
  }

  queryStringify(breakdown, recipe_id) {
    let query_string = 'breakdown='.concat(breakdown.toString()).concat('&recipe_id=').concat(recipe_id);
    return query_string;
  }

  componentDidMount() {
    // Get detailed instructions
    let query_string = this.queryStringify(true, this.state.recipe_id);
    axios.get('http://127.0.0.1:5000/insts?' + query_string)
    .then(response => {
      console.log('NAENAE:', response)
      this.setState({instructions: response.data});
    })
    .catch(err => {
      console.log(err.response);
    });
  }

//   componentDidUpdate() {
//     if (this.props.match.params.userId !== this.state.user._id) {
//       axios.get('user/' + this.props.match.params.userId)
//       .then(response => {
//         this.setState({user: response.data});
//         this.props.changeView(response.data.first_name + ' ' + response.data.last_name + '\'s profile');
//       })
//       .catch(err => {
//         console.log(err.response);
//       })
//     this.render();
//     }
//   }

  render() {
    console.log(this.state.instructions);
    if (this.state.instructions) {
      return (
        <div>
          <Typography variant='h2'>
            {this.state.user.first_name + ' ' + this.state.user.last_name}
            <br/>
          </Typography>
          <Typography variant='subtitle1'>
            &quot;{this.state.user.description}&quot;
            <br/>
            <strong>Location: </strong> {this.state.user.location}
            <br/>
            <strong>Occupation: </strong> {this.state.user.occupation}
            <br/><br/>
          </Typography>
          {/* <Button variant='contained' color='primary' className='cs142-userDetail-button' component='a'
            href = {'#/photos/' + this.state.user._id}>
            Photos
          </Button>
          <br/> <br/> <Divider/>
          <Typography variant='h5'>Mentioned in:</Typography>
          <br/>
          {this.state.user.mentioned.length >= 1 ? (
            this.state.user.mentioned.map((photo_id, i) => {
              return <Mentions key={photo_id + i} curr_user_id={this.props.curr_user_id} photo_id={photo_id} />;
            })
          ) : (
            <Typography>No mentions</Typography>
          )} */}
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default RecipeInstructions;
