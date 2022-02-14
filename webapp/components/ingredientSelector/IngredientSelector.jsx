import React from 'react';
import {Button, Card, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Tooltip, Typography} from '@material-ui/core';
import {Mention, MentionsInput} from 'react-mentions';
import {Clear} from '@material-ui/icons';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './IngredientSelector.css';
import axios from 'axios';

/**
 * Ingredient Selector component for ML-based ingredient detection and manual ingredient selection
 */
class IngredientSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: undefined,
      detected_ingredients: {},
      added_ingredients: {},
      added_ingredient_text: '',
      include_pantry: true,
      // Tag state properties
      tags: [],
      add_tags: '',
      show_tags: false,
      show_tag_boxes: false,
      crop_units: {unit: '%'},
    }
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTagAdd = this.handleTagAdd.bind(this);
    this.handleTagSubmit = this.handleTagSubmit.bind(this);
    this.handleTagToggle = this.handleTagToggle.bind(this);
    this.handleClearButton = this.handleClearButton.bind(this);
    this.handleDetectedIngredientChange = this.handleDetectedIngredientChange.bind(this);
    this.detectedIngredientsList = this.detectedIngredientsList.bind(this);
    this.handleAddedIngredientChange = this.handleAddedIngredientChange.bind(this);
    this.addedIngredientsList = this.addedIngredientsList.bind(this);
    this.handleAddedIngredientTextChange = this.handleAddedIngredientTextChange.bind(this);
    this.handleAddedIngredientButtonClick = this.handleAddedIngredientButtonClick.bind(this);
    this.handlePantryCheckbox = this.handlePantryCheckbox.bind(this);
  }

  componentDidMount() {
    axios.get('/photosOfUser/' + this.props.curr_user_id)
    .then(response => {
      let photo_list = response.data;
      photo_list.sort(function(a, b){
        return b.date - a.date;
      });
      this.setState({photo: photo_list[photo_list.length-1]});
    })
    .catch(err => {
      console.log(err.response);
    });
    // Hard-code some detected ingredients
    let detected_example = {'apple': true, 'flour': true, 'sugar': true};
    this.setState({detected_ingredients: detected_example});
  }

  // componentDidUpdate() {
  //   if (this.props.match.params.userId !== this.state.user._id) {
  //     axios.get('user/' + this.props.match.params.userId)
  //     .then(response => {
  //       this.setState({user: response.data});
  //       this.props.changeView(response.data.first_name + ' ' + response.data.last_name + '\'s profile');
  //     })
  //     .catch(err => {
  //       console.log(err.response);
  //     })
  //   this.render();
  //   }
  // }

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
    axios.post('/addTag/' + this.state.photo.id, {
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
      })
      .catch(err => console.log(err.response));
  }

  handleTagToggle(display) {
    this.setState({show_tags: display});
  }

  handleClearButton() {
    this.setState({
      show_tag_boxes: false,
      crop_units: {unit: '%'}
    })
  }

  handleDetectedIngredientChange = ingredient => () => {
    let new_detected_ingredients = this.state.detected_ingredients;
    new_detected_ingredients[ingredient] = !new_detected_ingredients[ingredient];
    this.setState({detected_ingredients: new_detected_ingredients});
  }

  detectedIngredientsList() {
    return(
      <FormGroup>
        {Object.keys(this.state.detected_ingredients).map(ingredient => {
          return (
            <FormControlLabel
              key={ingredient}
              control={
                <Checkbox
                  checked={this.state.detected_ingredients[ingredient]}
                  onChange={this.handleDetectedIngredientChange(ingredient)}
                  value={ingredient}
                />
              }
              label={ingredient}
            />
          );
        })}
      </FormGroup>
    );
  }

  handleAddedIngredientChange = ingredient => () => {
    let new_added_ingredients = this.state.added_ingredients;
    new_added_ingredients[ingredient] = !new_added_ingredients[ingredient];
    this.setState({added_ingredients: new_added_ingredients});
  }

  addedIngredientsList() {
    return(
      <FormGroup>
        {Object.keys(this.state.added_ingredients).map(ingredient => {
          return (
            <FormControlLabel
              key={ingredient}
              control={
                <Checkbox
                  checked={this.state.added_ingredients[ingredient]}
                  onChange={this.handleAddedIngredientChange(ingredient)}
                  value={ingredient}
                />
              }
              label={ingredient}
            />
          );
        })}
      </FormGroup>
    );
  }

  handleAddedIngredientTextChange(event) {
    this.setState({added_ingredient_text: event.target.value});
  }

  handleAddedIngredientButtonClick() {
    let new_ingredient = this.state.added_ingredient_text;
    let new_added_ingredients = this.state.added_ingredients;
    if(new_added_ingredients[new_ingredient] === undefined) {
      new_added_ingredients[new_ingredient] = true;
    }
    else {
      new_added_ingredients[new_ingredient] = !new_added_ingredients[new_ingredient];
    }
    this.setState({added_ingredients: new_added_ingredients});
    console.log(Object.keys(this.state.added_ingredients));
  }

  handlePantryCheckbox() {
    let pantry_checkbox_status = this.state.include_pantry;
    pantry_checkbox_status = !pantry_checkbox_status;
    this.setState({include_pantry: pantry_checkbox_status});
  }

  render() {
    if (this.state.photo) {
      return (
        <div>
          <Typography variant='h4'>
            Uploaded Photo
            <br/>
          </Typography>
          <Card className='photo-content' onMouseEnter={() => this.handleTagToggle(true)} onMouseLeave={() => this.handleTagToggle(false)}>
            <ReactCrop className='my-react-crop' onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}
              crop={this.state.crop_units} onChange={(crop, percentCrop) => this.handleDrag(crop, percentCrop)}
              src={'/images/' + this.state.photo.file_name}
            >
              {this.state.show_tags ? this.state.photo.tags.map((tag, idx) => (
                <Tooltip key={idx} interactive>
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
                  <Button variant='contained' color='primary' style={{ left: 170, width: 30 }} onClick={this.handleClearButton}>
                    <Clear/>
                  </Button>
                </div>
              )}
            </ReactCrop>
            <Typography variant='body1'>
              Posted on {this.state.photo.date_time}
            </Typography>
          </Card>
          <br/> <br/> <Divider/>
          {/* Detected Ingredients */}
          <Typography variant='h5'>
            Detected Ingredients:
            <br/>
          </Typography>
          {Object.keys(this.state.detected_ingredients).length >= 1 ? (
            this.detectedIngredientsList()
          ) : (
            <Typography>No ingredients detected</Typography>
          )}
          <br/> <Divider/>
          {/* Manually Added Ingredients */}
          <Typography variant='h5'>
            Manually Added Ingredients:
            <br/>
          </Typography>
          {Object.keys(this.state.added_ingredients).length >= 1 ? (
            this.addedIngredientsList()
          ) : (
            <Typography>No ingredients manually added</Typography>
          )}
          <form onSubmit={() => this.handleAddedIngredientButtonClick()}>
            <Grid container direction='row' justifyContent='space-between'>
              <Grid item id='added-ingredient-textbox'>
                <label>
                  <MentionsInput singleLine value={this.state.added_ingredient_text} onChange={this.handleAddedIngredientTextChange}>
                    <Mention trigger='@' data={this.state.detected_ingredients} displayTransform={(_, display) => '@' + display}/>
                  </MentionsInput>
                </label>
                </Grid>
              <Grid item>
                <Button variant='contained' color='primary' size='small' type='submit'>
                  ADD
                </Button>
              </Grid>
            </Grid>
          </form>
          <br/> <Divider/>
          {/* Pantry Ingredients */}
          <Typography variant='h5'>
            Include typical pantry items:
            <br/>
          </Typography>
          <FormGroup>
            <FormControlLabel
              key={'Check to include'}
              control={
                <Checkbox
                  checked={this.state.include_pantry}
                  onChange={this.handlePantryCheckbox}
                  value={'Check to include'}
                />
              }
              label='Check to include'
            />
          </FormGroup>
          <br/> <Divider/>
        </div>
      );
    }
    else {
      return (<div/>); 
    }
  }
}

export default IngredientSelector;
