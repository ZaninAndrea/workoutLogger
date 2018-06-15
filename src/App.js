import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ExerciseDatabase from "./components/ExerciseDatabase";
import PastWorkouts from "./components/PastWorkouts";
import NewWorkout from "./components/NewWorkout";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    // height: 430,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme } = this.props;

    const drawerContent = (
      <div>
        <div className={classes.toolbar} />
        <List component="nav">
          <ListItem
            component={Link}
            to="/"
            onClick={this.handleDrawerToggle}
            button
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            component={Link}
            to="/exercises"
            onClick={this.handleDrawerToggle}
            button
          >
            <ListItemText primary="Exercises" />
          </ListItem>
          <ListItem
            component={Link}
            to="/newWorkout"
            onClick={this.handleDrawerToggle}
            button
          >
            <ListItemText primary="New Workout" />
          </ListItem>
          <ListItem
            component={Link}
            to="/workouts"
            onClick={this.handleDrawerToggle}
            button
          >
            <ListItemText primary="Past Workouts" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <Router>
        <div className={classes.root}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>

              {/* change title depending on route */}
              <Typography variant="title" color="inherit" noWrap>
                <Route exact path="/" component={() => "Home"} />

                <Route
                  path="/exercises"
                  exact
                  component={() => "Exercise Database"}
                />
                <Route
                  path={`/exercises/exercise-:topicId`}
                  component={({ match }) => match.params.topicId}
                />
                <Route
                  path={`/exercises/new`}
                  component={() => "New Exercise"}
                />

                <Route
                  path="/workouts"
                  exact
                  component={() => "Past Workouts"}
                />
                <Route
                  path={`/workouts/:topicId`}
                  component={({ match }) => match.params.topicId}
                />
                <Route path="/newWorkout" component={() => "New Workout"} />
              </Typography>
            </Toolbar>
          </AppBar>
          {/* temporary drawer shown on mobile */}
          <Hidden mdUp>
            <SwipeableDrawer
              variant="temporary"
              anchor={"left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawerContent}
            </SwipeableDrawer>
          </Hidden>
          {/* permanent drawer shown on PC */}
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawerContent}
            </Drawer>
          </Hidden>

          <div className="pageContent">
            <Route exact path="/" component={Home} />
            <Route path="/exercises" component={ExerciseDatabase} />
            <Route path="/workouts" component={PastWorkouts} />
            <Route path="/newWorkout" component={NewWorkout} />
          </div>
        </div>
      </Router>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
