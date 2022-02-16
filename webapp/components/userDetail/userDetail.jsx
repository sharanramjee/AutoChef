import React from 'react';
import {Button, Divider, Typography} from '@material-ui/core';
import './userDetail.css';
import Mentions from './Mentions';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    }
  }

  componentDidMount() {
    axios.get('user/' + this.props.match.params.userId)
    .then(response => {
      this.setState({user: response.data});
      this.props.changeView(
        response.data.first_name + ' ' + response.data.last_name + '\'s profile'
      );
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  componentDidUpdate() {
    if (this.props.match.params.userId !== this.state.user._id) {
      axios.get('user/' + this.props.match.params.userId)
      .then(response => {
        this.setState({user: response.data});
        this.props.changeView(response.data.first_name + ' ' + response.data.last_name + '\'s profile');
      })
      .catch(err => {
        console.log(err.response);
      })
    this.render();
    }
  }

  render() {
    if (this.state.user) {
      return (
        <div className='cs142-userDetail-container'>
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

export default UserDetail;
