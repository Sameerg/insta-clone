import React, { useState } from "react";
import "./Header.css";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import ImageUpload from "./ImageUpload";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import InstagramIcon from "@material-ui/icons/Instagram";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

import firebase from "firebase/app";

function Header(props) {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 380,
      backgroundColor: theme.palette.background.paper,
      border: "0px solid #000",
      boxShadow: theme.shadows[4],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();

  const handleLogin = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      // .then(props.user => console.log(user))
      .catch((error) => alert(error.message));
    setOpen(false);
    handleClose();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      // .then(props.user => console.log(user))
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
    handleClose();
  };

  return (
    <div>
      <Modal animation="false" open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__header__signup">
            <center>
              <h2>Instagram</h2>
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={props.username}
              onChange={(e) => props.setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={!props.username || !email || !password}
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        animation="false"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__header__signup">
            <center>
              <h2>Sign In</h2>
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button disabled={!email || !password} onClick={handleSignIn}>
              Submit
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        animation="false"
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <h2>Upload</h2>
          </center>
          <ImageUpload
            user={props.user}
            onImageUpload={() => setOpenUpload(false)}
          />
        </div>
      </Modal>

      <div className="app__header">
        {props.user && (
          <div className="app__headerUploadButton">
            <Button onClick={() => setOpenUpload(true)}>
              <InstagramIcon />
            </Button>
          </div>
        )}
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="Instagram"
        ></img>
        {props.user ? (
          <div className="app__headerButton">
            <div>
              <MenuIcon className={classes.small} onClick={handleClick} />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>{props.user.displayName}</MenuItem>
                <MenuItem onClick={() => alert("To do")}>Profile</MenuItem>
                <MenuItem onClick={() => firebase.auth().signOut()}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
            {/* <Button onClick={() => firebase.auth().signOut()}>Log Out</Button> */}
          </div>
        ) : (
          <div className="app__headerButton">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
