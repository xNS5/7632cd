import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Avatar, Box, Typography} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 11,
    color: '#BECCE2',
    fontWeight: 'bold',
    marginTop: 10
  },
  text: {
    fontSize: 14,
    color: '#91A3C0',
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: 'bold',
  },
  bubble: {
    background: '#F4F6FA',
    borderRadius: '10px 10px 0 10px',
  },
  readMarker: {
    height: 'auto',
    width: 20,
    marginTop: 10,
    marginLeft: 10,
  }
}));

const SenderBubble = ({ time, text, read, otherUser}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      { read === true  &&  <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.readMarker} /> }
    </Box>
  );
};

export default SenderBubble;
