import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'
import { Link } from "react-router-dom"

import logo from '../../assets/logo.svg'

function ElevationScroll(props) {
  const { children, } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

// We use useStyles and makeStyles here to solve the issue that is
// the lack of a margin underneath the toolbar.  By using a predefined
// 'mixin' that is accessed from https://material-ui.com/customization/default-theme/
// By using the default theme, we can make general changes to overall theme by using 
// a Theme.jsx file and locate it inside of a 'ui' folder.  But, there are some times
// when inline changes will need to be made, you cand do this by accessing useStyles

// Since theme.mixins.toolbar only covered the original toolbar height, we add a
// marginBottom of 3em to offset the new change due to the increase in image size
// we were looking to obtain

const useStyles = makeStyles(theme => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "3em"
  },
  logo: {
    height: "8em",
  },
  logoContainer: {
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  tabContainer: {
    marginLeft: 'auto'
  },
  // We extrated 4 different Tab options to place in Theme.jsx, we did
  // This in order to scale with reuse in other places inside of the website
  // we may use. 
  tab: {
    ...theme.typography.tab,
    minWidth: 10,
    marginLeft: "25px"
  },
  button: {
    ...theme.typography.estimate,
    borderRadius: "50px",
    marginLeft: "50px",
    marginRight: "25px",
    height: "45px",
  }
}))


export default function Header(props) {
  const classes = useStyles();
  // we use const [value, setValue] = useState(0); to create a hook to allow for selection
  // of tab we are using.  We pipe this to "Tabs" in order to control the highlighting / bolding
  const [value, setValue] = useState(0);
  // handleChange requires an event and value and uses setValue created from hook to set state
  const handleChange = (e, value) => {
    setValue(value)
  }

  // useEffect is a lifecycle hook that is for material ui.  It allows actions / functions to be
  // done after an update.  In order to make sure that the page reflects the active page when refreshing,
  // useEffect is necessary for a check. [value] is needed as a second prop to prevent infinite loops.

  useEffect(() => {
    if (window.location.pathname === "/" && value !== 0) {
      setValue(0)
    } else if (window.location.pathname === "/services" && value !== 1) {
      setValue(1)
    } else if (window.location.pathname === "/revolution" && value !== 2) {
      setValue(2)
    } else if (window.location.pathname === "/about" && value !== 3) {
      setValue(3)
    } else if (window.location.pathname === "/contact" && value !== 4) {
      setValue(4)
    } else if (window.location.pathname === "/estimate" && value !== 5) {
      setValue(5)
    }
  }, [value]);

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar position="fixed" >
          <Toolbar disableGutters>
            <Button component={Link} to="/" disableRipple onClick={() => setValue(0)}
              className={classes.logoContainer}>
              <img alt="company logo" className={classes.logo} src={logo} />
            </Button>
            <Tabs
              value={value}
              onChange={handleChange}
              className={classes.tabContainer}
              indicatorColor="primary"
            >
              <Tab className={classes.tab}
                component={Link} to="/"
                label="Home"
              />
              <Tab
                className={classes.tab}
                component={Link} to="/services"
                label="Services" />
              <Tab
                className={classes.tab}
                component={Link} to="/revolution"
                label="The Revolution" />
              <Tab
                className={classes.tab}
                component={Link} to="/about"
                label="About Us" />
              <Tab
                className={classes.tab}
                component={Link} to="/contact"
                label="Contact Us" />
            </Tabs>
            <Button variant="contained" color="secondary" className={classes.button}>
              Free Estimate
            </Button>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}
