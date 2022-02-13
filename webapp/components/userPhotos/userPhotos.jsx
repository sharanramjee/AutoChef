import React from 'react';
import {Grid} from '@material-ui/core';
import './userPhotos.css';
import Photo from './Photo';
import axios from 'axios';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      photos: undefined,
      comment: '',
      favorite_ids: [],
    };
    this.updatePhotos = this.updatePhotos.bind(this);
    this.updatePhotos();
  }

  componentDidMount() {
    axios.get('/user/' + this.props.match.params.userId)
      .then(response => {
        this.setState({user: response.data});
        this.props.changeView(response.data.first_name + ' ' + response.data.last_name + '\'s photos');
      })
      .catch(err => console.log(err.response));
  }

  updatePhotos() {
    axios.get('/photosOfUser/' + this.props.match.params.userId)
      .then(response => {
        this.setState({photos: response.data});
      })
      .catch(err => {
        console.log(err.response);
      });
    axios.get('/getFavorites')
      .then(response => {
        let favorite_ids = response.data.map(photo => photo._id);
        this.setState({favorite_ids});
      })
      .catch(() => this.setState({favorite_ids: []}));
  }

  render() {
    return this.state.user ? (
      <div>
        <Grid container direction='column' padding={8} justifyContent='space-between' alignItems='center'>
          {this.state.photos ? (
            this.state.photos.sort((photo1, photo2) => photo2.liked_by.length - photo1.liked_by.length).map(photo =>
              photo.users_permitted.indexOf(this.props.curr_user_id) > -1 && (
                <Grid item xs key={photo._id} style={{width: '100%'}}>
                  <Photo style={{}} creator={this.state.user} updatePhotos={this.updatePhotos} photo={photo}
                    favorited={this.state.favorite_ids.indexOf(photo._id) >= 0}
                    liked={photo.liked_by.indexOf(this.props.curr_user_id) >= 0}
                  />
                  <br/>
                </Grid>
              )
            )
          ) : (
            <div/>
          )}
        </Grid>
      </div>
    ) : (
      <div/>
    );
  }
}

export default UserPhotos;