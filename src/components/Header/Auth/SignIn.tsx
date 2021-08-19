import React, {
  ChangeEvent, FC, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import fetchUsers from 'store/actionCreator/user';

// Material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Fade,
  FormControl, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { Users } from 'types/user';
import useTypeSelector from 'components/hooks/useTypeSelector';
// styles
import { NavLink } from 'react-router-dom';
import useStyles from './styles';

const SignIn: FC = () => {
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { users } = useTypeSelector((state) => state.users);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState<string>('');
  const [userEmail, setEmail] = useState<string>('');
  const [userPassword, setPassword] = useState<string>('');

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggin, setIsLoggin] = useState<boolean>(false);

  const [menu, setOpenMenu] = React.useState<null | HTMLElement>(null);
  const open = Boolean(menu);

  const cleaningFields = (): void => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const emailHandler = ({ target } : ChangeEvent<HTMLInputElement>): void => {
    setEmail(target.value);
  };

  const passwordHandler = ({ target } : ChangeEvent<HTMLInputElement>): void => {
    setPassword(target.value);
  };

  const handleClickOpemSignIn = () => {
    setDialogOpen(true);
  };

  const handleClickCloseSignIn = () => {
    setDialogOpen(false);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    closeMenu();
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email: userEmail, password: userPassword });
      console.log(response);
      setUserName(response.data.user.name);
      setIsLoggin(true);
      if (response.data.user.isAdmin !== undefined) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      const userId = response.data.user.id;
      const token = response.data.accessToken;
      console.log(userId);
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('userID', JSON.stringify(userId));
      setAuthorizationToken(token);
    } catch (e) {
      setIsLoggin(false);
      console.log(e);
    }
    handleClickCloseSignIn();
    cleaningFields();
  };

  function setAuthorizationToken(token: string): void {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }

  return (
    <>
      { isLoggin && (
      <>
        <Menu
          id="fade-menu"
          anchorEl={menu}
          keepMounted
          open={open}
          onClose={closeMenu}
          TransitionComponent={Fade}
          style={{ left: -80, top: -2 }}
        >
          {isAdmin && (
          <NavLink
            to="/editor"
            className={classes.link}
          >
            <MenuItem onClick={closeMenu}>Editor</MenuItem>
          </NavLink>
          )}
          <NavLink
            to="/favorites"
            className={classes.link}
          >
            <MenuItem onClick={closeMenu}>Favorites</MenuItem>
          </NavLink>
          <MenuItem
            onClick={() => handleLogout()}
            className={classes.link}
          >
            Logout
          </MenuItem>
        </Menu>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={openMenu}
        >
          <MoreVertIcon />
        </IconButton>
      </>
      )}
      <Button onClick={handleClickOpemSignIn}><NavLink to="/signin" className={classes.navItem}>{userName ? `${userName}` : 'Sign in'}</NavLink></Button>
      <Dialog
        open={isDialogOpen}
        onClose={handleClickCloseSignIn}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.dialogTitle}>Login</DialogTitle>
        <FormControl className={classes.formControl}>
          <TextField
            autoFocus
            label="Email"
            type="email"
            className={classes.field}
            value={userEmail}
            onChange={emailHandler}
          />
          <TextField
            autoFocus
            label="Password"
            type="password"
            className={classes.field}
            value={userPassword}
            onChange={passwordHandler}
          />
        </FormControl>

        <DialogActions className={classes.formFooter}>

          <NavLink to="/" onClick={handleClickCloseSignIn} className={classes.navBtnBack}>Go back</NavLink>
          <Button onClick={() => login()} color="primary">
            SignIn
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default SignIn;