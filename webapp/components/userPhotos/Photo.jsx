import React from 'react';
import {Button, Card, CardActions, CardContent, Grid, IconButton, ListItem, ListItemText, Tooltip, Typography} from '@material-ui/core';
import {Clear, Favorite, FavoriteBorder, ThumbUp, ThumbUpOutlined} from '@material-ui/icons';
import {Mention, MentionsInput} from 'react-mentions';
import {Link} from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import photoStyle from '../styles/photoStyle';
import mentionStyle from '../styles/mentionStyle';
import './Photo.css';
import axios from 'axios';

const mention_pattern = /@\[(\S+ \S+)( )*\]\(\S+\)/g;

/**
 * Define Photo, a React componment of CS142 project #8
 */
class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined,
      comment: undefined,
      comment_mentions: [],
      liked: props.liked,
      favorited: props.favorited,
      tags: [],
      add_tags: '',
      show_tags: false,
      show_tag_boxes: false,
      crop_units: {unit: '%'},
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentAdd = this.handleCommentAdd.bind(this);
    this.handleMentionsChange = this.handleMentionsChange.bind(this);
    this.handleLikeChange = this.handleLikeChange.bind(this);
    this.handleFavoriteChange = this.handleFavoriteChange.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagSubmit = this.handleTagSubmit.bind(this);
    this.handleTagToggle = this.handleTagToggle.bind(this);
  }

  componentDidMount() {
    axios.get('/user/selectMentions')
      .then(response => {
        this.setState({users: response.data});
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  handleCommentChange(event) {
    this.setState({ comment: event.target.value });
  }

  handleCommentAdd(event, photo_id) {
    event.preventDefault();
    axios.post('/commentsOfPhoto/' + photo_id, {
        comment: this.state.comment,
        mentions: this.state.comment_mentions
      })
      .then(() => {
        this.setState({comment: '', comment_mentions: []});
        this.props.updatePhotos();
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  handleMentionsChange() {
    this.setState({
      show_tag_boxes: false,
      crop_units: {unit: '%'}
    })
  }

  handleLikeChange() {
    axios.post('/likePhoto/' + this.props.photo._id, {
        like: !this.state.liked
      })
      .then(() => {
        this.setState({liked: !this.state.liked});
        this.props.updatePhotos();
      })
      .catch(err => console.log(err.response));
  }

  handleFavoriteChange(){
    axios.post('/addFavorite', {photo_id: this.props.photo._id})
      .then(() => {
        this.props.updatePhotos();
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  handleDragStart() {
    this.setState({show_tag_boxes: false});
  }

  handleDrag(_, percentCrop) {
    this.setState({crop_units: percentCrop});
  }

  handleDragEnd() {
    this.setState({show_tag_boxes: true});
  }

  handleTagAdd(event) {
    this.setState({add_tags: event.target.value});
  }

  handleTagSubmit(id, full_name) {
    let {x, y, width, height} = this.state.crop_units;
    axios.post('/addTag/' + this.props.photo._id, {
        user_id: id,
        x: x,
        y: y,
        width: width,
        height: height,
        full_name: full_name
      })
      .then(() => {
        this.setState({
          add_tags: '',
          show_tag_boxes: false,
          crop_units: {unit: '%'}
        });
        this.props.updatePhotos();
      })
      .catch(err => console.log(err.response));
  }

  handleTagToggle(display) {
    this.setState({show_tags: display});
  }

  render() {
    return (
      // Photo content
      <Card className='photo-content' onMouseEnter={() => this.handleTagToggle(true)} onMouseLeave={() => this.handleTagToggle(false)}>
        <ReactCrop className='my-react-crop' onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}
          crop={this.state.crop_units} onChange={(crop, percentCrop) => this.handleDrag(crop, percentCrop)}
          src={'/images/' + this.props.photo.file_name}
        >
          {this.state.show_tags ? this.props.photo.tags.map((tag, idx) => (
            <Tooltip key={idx} interactive
              title={<Link id='hover-for-name' to={'/users/' + tag.user_id}> {tag.full_name} </Link>}>
              <div className='rect-tag-crop'
                style={{
                  width: `${tag.width}%`,
                  height: `${tag.height}%`,
                  left: `${tag.x}%`,
                  top: `${tag.y}%`
                }}
              />
            </Tooltip>
          )) : null}
          {this.state.crop_units.width > 1 && this.state.show_tag_boxes && (
            <div className='tag-input-photo'
              style={{
                left: `${this.state.crop_units.x}%`,
                top: `${this.state.crop_units.y}%`
              }}
            >
              <MentionsInput singleLine allowSuggestionsAboveCursor value={this.state.add_tags} onChange={this.handleTagAdd}
                style={(function() {
                  let style = mentionStyle;
                  style.right = 30;
                  return style;
                })()}>
                <Mention trigger='' data={this.state.users} displayTransform={(_, display) => `${display}`} onAdd={this.handleTagSubmit}/>
              </MentionsInput>
              <Button variant='contained' color='primary' style={{ left: 170, width: 30 }} onClick={this.handleMentionsChange}>
                <Clear />
              </Button>
            </div>
          )}
        </ReactCrop>
        <Typography variant='body1'>
          Posted on {this.props.photo.date_time}
        </Typography>

        {/* Like and favorite actions */}
        <CardActions>
        <IconButton aria-label='add to favorites' disabled={this.props.favorited} onClick={this.handleFavoriteChange}>
            {this.props.favorited ? (
              <Favorite color='secondary' />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <IconButton aria-label='like' onClick={this.handleLikeChange}>
            {this.state.liked ? (
              <ThumbUp color='primary' />
            ) : (
              <ThumbUpOutlined />
            )}
          </IconButton>
          <Typography variant='h4' color='primary'>
            {this.props.photo.liked_by.length}
          </Typography>
        </CardActions>

        {/* Comment section */}
        <CardContent className='photo-comment-content'>
          {this.props.photo.comments ? (
            <div className='photo-comment-info'>
              {this.props.photo.comments.map(comment => {
                // Show current comments
                return (
                  <Grid container justify='space-between' padding={5} key={comment._id}>
                    <Grid item xs={3}>
                      <div className='comment-name'>
                        <ListItem button component={Link} to={'/users/' + comment.user._id}>
                          <ListItemText primary={comment.user.first_name + ' ' + comment.user.last_name}/> 
                        </ListItem>
                      </div>
                    </Grid>
                    
                    <Grid item xs={9} className='photo-comment-text'>
                      <div className='comment-content'>
                        <ListItem>
                          <ListItemText primary={comment.comment.replace(mention_pattern, (_, p1) => {
                            return `@${p1}`;
                          })}
                          secondary={comment.date_time}/>
                        </ListItem>
                      </div>
                    </Grid>
                  </Grid>
                );
              })}

              {/* Adding new comments */}
              <br/>
              <form className='add-comment' onSubmit={event => this.handleCommentAdd(event, this.props.photo._id)}>
                <Typography>
                  Add comment: {' '}
                </Typography>
                <label className='comment-input'>
                  <MentionsInput className='mention-input-comment' singleLine allowSuggestionsAboveCursor
                    style={photoStyle} value={this.state.comment} onChange={this.handleCommentChange}
                  >
                    <Mention trigger='@' data={this.state.users} displayTransform={(_, display) => '@' + display}
                      onAdd={(user_id) => {
                        let mentions = this.state.comment_mentions;
                        mentions.push(user_id);
                        this.setState({comment_mentions: mentions});
                      }}
                    />
                  </MentionsInput>
                </label>
                <Button variant='contained' color='primary' size='small' type='submit'>
                  Post
                </Button>
              </form>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }
}
export default Photo;