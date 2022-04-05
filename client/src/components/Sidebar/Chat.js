import React, {useEffect, useState} from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ user, conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const [unreadCount, setUnreadCount] = useState(0)
  const lastMessage = conversation.messages[conversation.messages.length-1];

  const handleClick = async (conversation) => {
    if(conversation.unreadMessageCount > 0){
      conversation.unreadMessageCount = 0;
      setUnreadCount(0);
    }
    await setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    if(conversation.unreadMessageCount > unreadCount && lastMessage.senderId !== user.id){
      setUnreadCount(conversation.unreadMessageCount)
    }
  }, [lastMessage, user, unreadCount, setUnreadCount, conversation])

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} user={user} unreadMessageCount={unreadCount}/>
    </Box>
  );
};

export default Chat;
