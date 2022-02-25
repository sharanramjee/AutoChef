import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Grid, Paper} from '@material-ui/core';
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles';
import './styles/main.css';
import axios from 'axios';

// import necessary components
import LoginRegister from './components/LoginRegister/LoginRegister';
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import FavoriteList from './components/favoriteList/FavoriteList';
import IngredientSelector from './components/ingredientSelector/ingredientSelector';
import RecommendedRecipes from './components/recommendedRecipes/RecommendedRecipes';
import RecipeInstructions from './components/recipeInstructions/RecipeInstructions';

class AutoChef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Home',
      isLoggedIn: true,
      login_name: undefined,
      current_user: undefined,
      update_favorites: false,
      upload_clicked: false,
      query_ingredients: [],
      query_include_pantry: true,
    }
    this.changeView = this.changeView.bind(this);
    this.changeLoggedIn = this.changeLoggedIn.bind(this);
    this.changeUpload = this.changeUpload.bind(this);
    this.changeQuery = this.changeQuery.bind(this);
    this.updateFavorites = this.updateFavorites.bind(this);
  }

  componentDidMount() {
    axios.get('/admin/current')
    .then(response => {
      let user = response.data;
      this.setState({current_user: user});
    })
    .catch(() => {
      this.setState({current_user: undefined});
    });
  }

  changeView(newView) {
    this.setState({view: newView});
  }

  changeLoggedIn(newUser) {
    if (!newUser){
      axios.post('/admin/logout', {})
      .then(() => {
        this.props.changeLoggedIn(undefined);
      })
      .catch(err => console.log(err.response));
    }
    this.setState({current_user: newUser});
  }

  changeUpload(newClick) {
    this.setState({upload_clicked: newClick});
  }

  changeQuery(new_query_ingredients, new_query_include_pantry) {
    this.setState({
      query_ingredients: new_query_ingredients,
      query_include_pantry: new_query_include_pantry
    });
  }

  updateFavorites(update_status) {
    if(this.state.update_favorites !== update_status) {
      this.setState({update_favorites: update_status});
    }
  }

  render() {
    const theme = createTheme({
      palette: {
        primary: {
          main:'#4caf50'
        },
        secondary: {
          main:'#6fbf73'
        },
      },
    })
    return (
    <MuiThemeProvider theme={theme}>
    <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar view={this.state.view} current_user={this.state.current_user} changeView={this.changeView}
          changeLoggedIn={this.changeLoggedIn} changeUpload={this.changeUpload} upload_clicked={this.state.upload_clicked}/>
        </Grid>
        <div className='cs142-main-topbar-buffer'/>
        <Grid item sm={3}>
          <Paper elevation={0} className='cs142-main-grid-item'>
            {this.state.current_user ? <FavoriteList updateFavorites={this.updateFavorites} updateFavoritesStatus={this.state.update_favorites} /> : null}
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper elevation={0} className='cs142-main-grid-item'>
            <Switch>
              {this.state.current_user ? (
                <Redirect path='/login-register' to={`/users/${this.state.current_user._id}`} />
              ) : (
                <Route exact path='/login-register'
                render={props => <LoginRegister {...props} changeLoggedIn={this.changeLoggedIn} /> }
                />
              )}
              {/* {this.state.current_user ? (
                <Route path='/favorites'
                render={props => <Favorites {...props} /> }
                />
              ) : (
                <Redirect path='/favorites' to='/login-register' />
              )} */}
              {this.state.current_user ? (
                <Route path='/users/:userId'
                  render={props => <UserDetail {...props} curr_user_id={this.state.current_user._id} changeView={this.changeView} /> }
                />
              ) : (
                <Redirect path='/users/:userId' to='/login-register' />
              )}
              {/* {this.state.current_user ? (
                <Route path='/photos/:userId'
                  render={props => <UserPhotos changeView={this.changeView} changeUpload={this.changeUpload}
                  upload_clicked={this.state.upload_clicked} curr_user_id={this.state.current_user._id} {...props} /> }
                />
              ) : (
                <Redirect path='/photos/:userId' to='/login-register' />
              )} */}
              {this.state.current_user ? (
                <Route path='/instructions/:recipe_id'
                  render={props => <RecipeInstructions {...props} /> }
                />
              ) : (
                <Redirect path='/instructions/:recipe_id' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Route path='/ingredient-selector'
                  render={props => <IngredientSelector changeQuery={this.changeQuery} curr_user_id={this.state.current_user._id} {...props} /> }
                />
              ) : (
                <Redirect path='/ingredient-selector' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Route path='/recommended-recipes'
                  render={props => <RecommendedRecipes curr_user_id={this.state.current_user._id} updateFavorites={this.updateFavorites}
                  updateFavoritesStatus={this.state.update_favorites} query_ingredients={this.state.query_ingredients}
                  query_include_pantry={this.state.query_include_pantry} {...props} /> }
                />
              ) : (
                <Redirect path='/recommended-recipes' to='/login-register' />
              )}
              {this.state.current_user ? (
                <Redirect path='/' to={`/users/${this.state.current_user._id}`} />
              ) : (
                <Redirect path='/' to='/login-register' />
              )}
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
    </HashRouter>
    </MuiThemeProvider>
    );
  }
}


ReactDOM.render(
  <AutoChef />,
  document.getElementById('autochefapp'),
);
