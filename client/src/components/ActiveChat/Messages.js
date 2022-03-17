import React from 'react';
import {Avatar, Box} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  readMarker: {
    height: 'auto',
    width: 20,
    marginTop: 6,
    float: 'right'
  }
}))

const Messages = (props) => {
  const classes = useStyles()
  const { messages, otherUser, userId } = props;

  //{ message.readStatus === true  ?  <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.readMarker} /> : null}
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        return message.senderId === userId ? (
            <SenderBubble  key={message.id} text={message.text} time={time}/>
        ) : (
          <OtherUserBubble
            key={message.id}
            time={time}
            text={message.text}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
