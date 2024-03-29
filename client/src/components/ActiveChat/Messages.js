import React from 'react';
import {Box} from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages= (props) => {
  const { messages, otherUser, userId} = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        return message.senderId === userId ? (
            <SenderBubble  key={message.id} text={message.text} read={message.isRead} otherUser={otherUser} time={time}/>
        ) : (
            <OtherUserBubble
                key={message.id}
                time={time}
                text={message.text}
                otherUser={otherUser}
                read={message.isRead}
            />
        );
      })}
    </Box>
  );
};

export default Messages;
