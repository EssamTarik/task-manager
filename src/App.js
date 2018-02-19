import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import logo from './logo.svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin'
import checkAuth from './actions/Auth/checkAuth';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {SidebarOpen: false};
    this.switchSidebar = this.switchSidebar.bind(this);
    this.props.checkAuth();
  }

  switchSidebar(){
    this.state.SidebarOpen = !this.state.SidebarOpen;
    this.setState(this.state);
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
      <Header projectID = {this.props.params.id} switchSidebar={this.switchSidebar}/>
      <Sidebar switchSidebar = {this.switchSidebar} open={this.state.SidebarOpen}/>
      {this.props.children}
      </div>
      </MuiThemeProvider>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({checkAuth: checkAuth}, dispatch);
}

export default connect(null,mapDispatchToProps)(App);
