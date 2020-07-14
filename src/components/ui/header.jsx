import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

import logo from '../../assets/logo.svg';

function ElevationScroll(props) {
  const { children } = props;

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

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '3em',
    [theme.breakpoints.down('md')]: {
      marginBottom: '2em',
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: '1.25em',
    },
  },
  logo: {
    height: '8em',
    // we place a media query based styling this way
    [theme.breakpoints.down('md')]: {
      height: '7em',
    },
    [theme.breakpoints.down('xs')]: {
      height: '5.5em',
    },
  },
  logoContainer: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  tabContainer: {
    marginLeft: 'auto',
  },
  // We extrated 4 different Tab options to place in Theme.jsx, we did
  // This in order to scale with reuse in other places inside of the website
  // we may use.
  tab: {
    ...theme.typography.tab,
    minWidth: 10,
    marginLeft: '25px',
  },
  button: {
    ...theme.typography.estimate,
    borderRadius: '50px',
    marginLeft: '50px',
    marginRight: '25px',
    height: '45px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  menu: {
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    borderRadius: '0px',
  },
  // menuItem is abstracting what we've already definded in our theme.jsx in typography.tab
  // we then copy the opacity that exists in our standard tab opacity when used and override
  // the hover component so that we can copy the same effect.
  menuItem: {
    ...theme.typography.tab,
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },
  drawerIcon: {
    height: '50px',
    width: '50px',
  },
  drawerIconContainer: {
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  drawer: {
    backgroundColor: theme.palette.common.blue,
  },
  drawerItem: {
    ...theme.typography.tab,
    color: 'white',
    opacity: 0.7,
  },
  drawerItemEstimate: {
    backgroundColor: theme.palette.common.orange,
  },
  drawerItemSelected: {
    '& .MuiListItemText-root': {
      opacity: 1,
    },
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  // Using this to check if device is rendered on an iOS
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  // we create matches to be true if the query is less than the md breakpoint
  // we moved all our tabs code into a const in order to render it on condition
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const [openDrawer, setOpenDrawer] = useState(false);
  // we use const [value, setValue] = useState(0); to create a hook to allow for selection
  // of tab we are using.  We pipe this to "Tabs" in order to control the highlighting / bolding

  // this is a hook that will store which element we clicked on and which to be rendered
  // Will contain services tab and what to render.
  const [anchorEl, setAnchorEl] = useState(null);

  // this is a hook that will help us render when the menu should be opened vs closed
  const [openMenu, setOpenMenu] = useState(false);

  // creating an index to select for menus

  // handleChange requires an event and value and uses setValue created from hook to set state
  const handleChange = (e, newValue) => {
    props.setValue(newValue);
  };

  // formula to handle changing pages based on what is clicked
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuItemClick = (e, index) => {
    setAnchorEl(null);
    setOpenMenu(false);
    props.setSelectedIndex(index);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const menuOptions = [
    {
      name: 'Services', link: '/services', activeIndex: 1, selectedIndex: 0,
    },
    {
      name: 'iOS/Android App Development', link: '/customsoftware', activeIndex: 1, selectedIndex: 1,
    },
    {
      name: 'Mobile App Development', link: '/mobileapps', activeIndex: 1, selectedIndex: 2,
    },
    {
      name: 'Website Development', link: '/websites', activeIndex: 1, selectedIndex: 3,
    },
  ];

  const routes = [
    { name: 'Home', link: '/', activeIndex: 0 },
    {
      name: 'Services',
      link: '/services',
      activeIndex: 1,
      ariaOwns: anchorEl ? 'simple-menu' : undefined,
      ariaPopup: anchorEl ? true : undefined,
      mouseOver: (event) => handleClick(event),
    },
    { name: 'The Revolution', link: '/revolution', activeIndex: 2 },
    { name: 'About Us', link: '/about', activeIndex: 3 },
    { name: 'Contact Us', link: '/contact', activeIndex: 4 },
  ];

  // useEffect is a lifecycle hook that is for material ui.  It allows actions / functions to be
  // done after an update.  In order to make sure that the page reflects the active page when refreshing,
  // useEffect is necessary for a check. [value] is needed as a second prop to prevent infinite loops.

  useEffect(() => {
    // Refactored switch statement
    //
    // First, we combine menuOptions and routes it create a bigger array with all the possible options
    // Then, for each "route" in this array, we are checking that the pathname of the page is the same as
    // listed in the array's "link". In the case that it does, it checks if our "value", which manages which "Tab"
    // will be highlighted.  If it does not equal the active index, it changes and overrides the value with route.activeIndex
    // Then, it checks if route.selectedIndex exists, AND if the route.selectedIndex does NOT equal the STATE HOOK
    // selectedIndex, it then overrides the state with setSelectedIndex(route.selectedIndex)

    [...menuOptions, ...routes].forEach((route) => {
      switch (window.location.pathname) {
        case `${route.link}`:
          if (props.value !== route.activeIndex) {
            props.setValue(route.activeIndex);
            if (route.selectedIndex && route.selectedIndex !== props.selectedIndex) {
              props.setSelectedIndex(route.selectedIndex);
            }
          }
          break;
        case '/estimate':
          props.setValue(5);
          break;
        default:
          break;
      }
    });
  }, [props.value, menuOptions, props.selectedIndex, routes, props]);

  const tabs = (
    <>
      <Tabs
        value={props.value}
        onChange={handleChange}
        className={classes.tabContainer}
        indicatorColor="primary"
      >
        {routes.map((route, index) => (
          <Tab
            key={`${route}${index}`}
            className={classes.tab}
            component={Link}
            to={route.link}
            label={route.name}
            aria-owns={route.ariaOwns}
            aria-haspopup={route.ariaPopup}
            onMouseOver={route.mouseOver}
          />
        ))}
      </Tabs>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/estimate"
        className={classes.button}
        onClick={() => props.setValue(5)}
      >
        Free Estimate
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        // Since we want to change the color of the 'paper' element that is abstracted to menu (Per documentation)
        // if we are looking in menu, you'll notice bottom the CSS mentions that paper needs to be edited
        // https://material-ui.com/components/menus/
        classes={{ paper: classes.menu }}
        // Since onMouseLeave / quit doesnt exist, we need to pass a prop to one of the APIs that menu is built on
        // Here, we pass onMouseLeave: handleClose to pass our defined function to MenuList through props
        MenuListProps={{ onMouseLeave: handleClose }}
        // elevation={0} overriedes the elevated element by default
        elevation={0}
        style={{ zIndex: 1302 }}
        keepMounted
      // ***MenuItem before Refactored***
      // we transform onClick={handleClose} into onClick={() => { handleClose(); setValue(1) }} in order to allow
      // the click to handle the changed highlighted tab at the top of the page.  This will run handle close && will
      // setValue of tab to 1 -- which is services
      >
        {menuOptions.map((option, i) => (
          <MenuItem
            // Breaking down the MenuItem map
            // key needs a unique key, since option will NEVER be the same, you can use this
            // component={Link} links up react router
            // to="x" links up where to route to
            // classes is overriding the "root" theme with our menuItem theme we created in beginning of code
            // onClick needs to pass an event into a series of functions
            //   1) handleMenuItemClick needs an event and an index in order to grab the event and save it to state in selectedIndex
            //   2) setValue is a hook to highlight the correct tab based on what page we're on
            //   3) handleClose needs to close the menu when clicked
            // selected is comparing the index in the map to selected index, it will return true if equals
            // {option.name} takes the "option" prop of an array we set called menuOptions earlier in code to use here
            key={`${option}${i}`}
            component={Link}
            to={option.link}
            classes={{ root: classes.menuItem }}
            onClick={(event) => { handleMenuItemClick(event, i); props.setValue(1); handleClose(); }}
            selected={i === props.selectedIndex && props.value === 1}
          >
            {option.name}
          </MenuItem>
        ))}

      </Menu>
    </>
  );

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{ paper: classes.drawer }}
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {routes.map((route) => (
            <ListItem
              key={`${route}${route.activeIndex}`}
              className={
                route.value === route.activeIndex
                  ? [classes.drawerItem, classes.drawerItemSelected]
                  : classes.drawerItem
              }
              onClick={() => { setOpenDrawer(false); props.setValue(route.activeIndex); }}
              divider
              button
              component={Link}
              to={route.link}
              selected={props.value === route.activeIndex}
              classes={{ selected: classes.drawerItemSelected }}
            >
              <ListItemText
                className={classes.drawerItem}
                disableTypography
              >
                {route.name}
              </ListItemText>
            </ListItem>
          ))}

          <ListItem
            classes={{ root: classes.drawerItemEstimate, selected: classes.drawerItemSelected }}
            onClick={() => { setOpenDrawer(false); props.setValue(5); }}
            divider
            button
            component={Link}
            to="/estimate"
            selected={props.value === 5}
          >
            <ListItemText
              className={classes.drawerItem}
              disableTypography
            >
              Free Estimate
            </ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </>
  );

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar disableGutters>
            <Button
              component={Link}
              to="/"
              disableRipple
              onClick={() => props.setValue(0)}
              className={classes.logoContainer}
            >
              <img alt="company logo" className={classes.logo} src={logo} />
            </Button>
            {matches ? drawer : tabs}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  );
}
