import React from 'react';
import {Divider, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import './userList.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined,
    }
  }

  componentDidMount() {
    axios.get('user/list')
    .then(response => {
      this.setState({users: response.data});
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  render() {
    if (this.state.users) {
      var userList = [];
      for(var i = 0; i < this.state.users.length; i++){
        userList.push(
          <div key = {i}>
            <ListItem button component={Link} to={'/users/' + this.state.users[i]._id}>
              <ListItemText className='user-name' primary={this.state.users[i].first_name + ' ' + this.state.users[i].last_name}/>
            </ListItem>
            <Divider />
          </div>
        );
      }
      return (
        <div className='cs142-userList-container'>
          <Typography variant='h5'>
            Users
          </Typography>
          <List component='nav'>
          <Divider/>
            {userList}
          </List>
        </div>
      )
    }
    else {
      return (<div/>); 
    }
  }
}

export default UserList;
