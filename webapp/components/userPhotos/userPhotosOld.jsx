import React from 'react';
import {Typography, Card, Button, ListItem, ListItemText, CardMedia, CardContent} from '@material-ui/core';
import './userPhotos.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: undefined,
      comment: '',
    }
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  componentDidMount() {
    axios.get('photosOfUser/' + this.props.match.params.userId)
    .then(photoResponse => {
      this.setState({photos: photoResponse.data});
      axios.get('user/' + this.props.match.params.userId)
      .then(userResponse => {
        this.props.changeView(userResponse.data.first_name + ' ' + userResponse.data.last_name + '\'s photos');
      })
      .catch(err => {
        console.log(err.response);
      })
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.upload_clicked === false && this.props.upload_clicked === true) || 
    (prevState.comment && !this.state.comment)) {
      axios.get('photosOfUser/' + this.props.match.params.userId)
      .then(photoResponse => {
        this.setState({photos: photoResponse.data});
        this.props.changeUpload(false);
      })
      .catch(err => {
        console.log(err.response);
      })
    }
  }

  handleAddComment(event, photo_id) {
    event.preventDefault();
    axios.post(`/commentsOfPhoto/${photo_id}`, {comment: this.state.comment})
      .then(() => {
        this.setState({comment: ''});
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  handleChangeInput(event) {
    this.setState({comment: event.target.value});
  }

  render() {
    if (this.state.photos) {
      return (
        <div className='cs142-userPhoto-container'>
          {this.state.photos.map(photo => (
            <div className='photos' key={photo._id}>
              <Card>
                <CardMedia
                  component='img'
                  width='300'
                  src={'/images/' + photo.file_name}
                />
                <CardContent>
                  <Typography variant='body1'>
                    Posted on {photo.date_time}
                  </Typography>
                  <br/>
                  <Typography>
                    <strong>Comments</strong>
                  </Typography>
                  {photo.comments && (
                    <div>
                      {photo.comments.map(comment => {
                        return (
                          <div className='comment' key={comment._id}>
                              <div className='comment-name'>
                                <ListItem button component={Link} to={'/users/' + comment.user._id}>
                                  <ListItemText primary={comment.user.first_name + ' ' + comment.user.last_name}/> 
                                </ListItem>
                              </div>
                              <div className='comment-content'>
                                <ListItem>
                                  <ListItemText primary={comment.comment} secondary={comment.date_time}/>
                                </ListItem>
                              </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {photo.comments.length === 0 && (
                    <Typography variant='body2'>No comments yet</Typography>
                  )}
                  <br/>
                  <form className='add-comment' onSubmit={(event) => this.handleAddComment(event, photo._id)}>
                    <label>
                      <Typography>
                        Add comment: {' '}
                        <input className='new-comment' type='text' value={this.state.comment} onChange={this.handleChangeInput} />
                        <Button variant='contained' color='primary' size='small' type='submit'>
                          Post
                        </Button>
                      </Typography>
                    </label>
                  </form>
                </CardContent>
              </Card>
              <br/>
            </div>
          ))}
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default UserPhotos;