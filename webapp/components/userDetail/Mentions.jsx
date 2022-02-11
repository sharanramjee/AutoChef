import React from 'react';
import {Card, CardContent, CardMedia, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import './Mentions.css';
import axios from 'axios';

/**
 * Define Mentions, a React componment of CS142 project #8
 */
class Mentions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: undefined,
    };
  }

  componentDidMount() {
    axios.get('/photosWithMentions/' + this.props.photo_id)
    .then(response => {
      this.setState({photo: response.data});
    })
    .catch(err => {
      console.log('Mentions error:', err.response);
    });
    
  }

  render() {
    return this.state.photo && this.state.photo.users_permitted.includes(this.props.curr_user_id) ? (
      <Card className='mention-card'>
        <Link to={'/photos/' + this.state.photo.photo_owner_id}>
          <CardMedia
            id='mention-photo'
            component='img'
            width='20'
            image={'/images/' + this.state.photo.file_name}
          />
        </Link>
        <CardContent>
          <Typography>
            <Link to={'/users/' + this.state.photo.photo_owner_id}>
              {this.state.photo.photo_owner_first_name + ' ' + this.state.photo.photo_owner_last_name}
            </Link>
            &apos;s photo
          </Typography>
        </CardContent>
      </Card>
    ) : null;
  }
}
export default Mentions;