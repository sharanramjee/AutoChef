import React from 'react';
import {Card, CardMedia, Grid, IconButton, Typography} from '@material-ui/core';
import {Favorite, FavoriteBorder} from '@material-ui/icons';
import './RecommendedRecipes.css';
import axios from 'axios';

/**
 * Suggested Recipes component for ML-based recommendation of recipes
 */
class RecommendedRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
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
    // Get the user
    axios.get('user/' + this.props.curr_user_id)
    .then(response => {
      this.setState({user: response.data});
      // this.props.changeView(
      //   response.data.first_name + ' ' + response.data.last_name + '\'s profile'
      // );
    })
    .catch(err => {
      console.log(err.response);
    })
    // Get the recipes
    let query_string = this.queryStringify(this.props.query_ingredients, this.props.query_include_pantry);
    axios.get('http://127.0.0.1:5000/recsys?' + query_string)
    .then(response => {
      this.setState({recipes: response.data});
    })
    .catch(err => {
      console.log(err.response);
    });
    // Hardcoded Spoonacular Recommendations
    // let rec_recipes = [
    //   {'aggregateLikes': 0,
    //   'healthScore': 19,
    //   'image': "https://spoonacular.com/recipeImages/673463-312x231.jpg",
    //   'missedIngredientCount': 2,
    //   'missedIngredient_names': ['beef broth', 'pork tenderloin'],
    //   'spoonacularScore': 56,
    //   'spoonacularId': 673463,
    //   'summary': "Slow Cooker Apple Pork Tenderloin is a <b>gluten free and primal</b> main course. For <b>$4.19 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. One serving contains <b>486 calories</b>, <b>34g of protein</b>, and <b>12g of fat</b>. Only a few people made this recipe, and 1 would say it hit the spot. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. Head to the store and pick up pork tenderloin, apples, cinnamon sugar, and a few other things to make it today. To use up the apple you could follow this main course with the <a href=\"https://spoonacular.com/recipes/apple-party-from-the-vault-apple-craisin-bread-pudding-515137\">Apple Party! From the Vault – Apple Craisin Bread Pudding</a> as a dessert. All things considered, we decided this recipe <b>deserves a spoonacular score of 58%</b>. This score is pretty good. Try <a href=\"https://spoonacular.com/recipes/slow-cooker-pork-tenderloin-143861\">Slow Cooker Pork Tenderloin</a>, <a href=\"https://spoonacular.com/recipes/havana-slow-cooker-pork-tenderloin-357547\">Havana Slow Cooker Pork Tenderloin</a>, and <a href=\"https://spoonacular.com/recipes/slow-cooker-teriyaki-pork-tenderloin-470380\">Slow Cooker Teriyaki Pork Tenderloin</a> for similar recipes.",
    //   'title': "Slow Cooker Apple Pork Tenderloin",
    //   'usedIngredientCount': 3,
    //   'usedIngredient_names': ['apple', 'cinnamon sugar', 'green apples'],
    //   'veryPopular': false},
    //   {'aggregateLikes': 1,
    //   'healthScore': 19,
    //   'image': "https://spoonacular.com/recipeImages/994607-312x231.jpg",
    //   'missedIngredientCount': 4,
    //   'missedIngredient_names': ['eggs', 'milk', 'salt', 'unsalted butter'],
    //   'spoonacularScore': 2,
    //   'spoonacularId': 994607,
    //   'summary': "You can never have too many main course recipes, so give Kaiserschmarrn a try. This lacto ovo vegetarian recipe serves 2 and costs <b>$1.37 per serving</b>. One portion of this dish contains about <b>29g of protein</b>, <b>32g of fat</b>, and a total of <b>783 calories</b>. From preparation to the plate, this recipe takes around <b>50 minutes</b>. It is brought to you by spoonacular user <a href=\"/profile/dsky\">dsky</a>. If you have eggs, milk, unsalted butter, and a few other ingredients on hand, you can make it. Users who liked this recipe also liked <a href=\"https://spoonacular.com/recipes/kaiserschmarrn-746265\">Kaiserschmarrn</a>, <a href=\"https://spoonacular.com/recipes/kaiserschmarrn-with-peaches-362963\">Kaiserschmarrn with Peaches</a>, and <a href=\"https://spoonacular.com/recipes/kaiserschmarrn-delicious-torn-pancake-ready-in-20-mins-860632\">Kaiserschmarrn – Delicious torn pancake. Ready in 20 Mins</a>.",
    //   'title': "Kaiserschmarrn",
    //   'usedIngredientCount': 3,
    //   'usedIngredient_names': ['vanilla sugar', 'white flour', 'white sugar'],
    //   'veryPopular': false},
    //   {'aggregateLikes': 7,
    //   'healthScore': 70,
    //   'image': "https://spoonacular.com/recipeImages/794527-312x231.jpg",
    //   'missedIngredientCount': 4,
    //   'missedIngredient_names': ['chia seeds', 'kefir', 'nuts', 'plain greek yogurt'],
    //   'spoonacularScore': 93,
    //   'spoonacularId': 794527,
    //   'summary': "You can never have too many main course recipes, so give Chia Yogurt Apricot Bowl a try. For <b>$4.46 per serving</b>, this recipe <b>covers 42%</b> of your daily requirements of vitamins and minerals. One serving contains <b>722 calories</b>, <b>55g of protein</b>, and <b>32g of fat</b>. This recipe is liked by 7 foodies and cooks. A mixture of toppings - crunchy nuts and apricots, greek yogurt, kefir, and a handful of other ingredients are all it takes to make this recipe so yummy. To use up the honey you could follow this main course with the <a href=\"https://spoonacular.com/recipes/honey-gingerbread-133051\">Honey Gingerbread</a> as a dessert. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. It is a good option if you're following a <b>gluten free, primal, and vegetarian</b> diet. All things considered, we decided this recipe <b>deserves a spoonacular score of 93%</b>. This score is tremendous. Try <a href=\"https://spoonacular.com/recipes/chia-yogurt-breakfast-bowl-718322\">Chia Yogurt Breakfast Bowl</a>, <a href=\"https://spoonacular.com/recipes/vanilla-almond-chia-breakfast-bowl-501463\">Vanilla-almond chia breakfast bowl</a>, and <a href=\"https://spoonacular.com/recipes/coconut-chia-pudding-breakfast-bowl-739125\">Coconut-Chia Pudding Breakfast Bowl</a> for similar recipes.",
    //   'title': "Chia Yogurt Apricot Bowl",
    //   'usedIngredientCount': 1,
    //   'usedIngredient_names': ['honey'],
    //   'veryPopular': false}
    // ]
    // this.setState({recipes: rec_recipes});
  }

  handleFavoriteChange(recipe_object){
    axios.post('/favoriteRecipe', {recipe: recipe_object})
      .then(() => {
        this.props.updateFavorites(true);
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
                    <Grid item>
                      <Grid container direction='row' justifyContent='space-between'>
                        <Grid item>
                          <Typography variant='h5'>
                            {recipe.title}
                          </Typography>
                        </Grid>
                        <Grid item>
                        <IconButton aria-label='Add to favorites' onClick={this.handleFavoriteChange(recipe)}>
                          {!this.state.user.favorites.includes(recipe.spoonacularId) ? (
                            <Favorite color='secondary' />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Typography variant='subtitle2'>
                        Used Ingredients [{recipe.usedIngredientCount}]: {recipe.usedIngredient_names.join(', ')}
                      </Typography>
                      <Typography variant='subtitle2'>
                        Additional Ingredients [{recipe.missedIngredientCount}]: {recipe.missedIngredient_names.join(', ')}
                      </Typography>
                      <Typography variant='body2' dangerouslySetInnerHTML={{ __html: recipe.summary }}/>
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
    if (this.state.user && this.state.recipes.length >= 1) {
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
