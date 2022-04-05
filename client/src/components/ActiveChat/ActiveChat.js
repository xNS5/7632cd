import React, {useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

const ActiveChat = ({
  user,
  conversations,
  activeConversation,
  postMessage,
  postRead,
}) => {
  const classes = useStyles();

  const conversation = useMemo(() => {
    return conversations
        ? conversations.find(
            (conversation) => conversation.otherUser.username === activeConversation
        )
        : {};
  }, [activeConversation, conversations])

  const isConversation = (obj) => {
    return obj !== {} && obj !== undefined;
  };


  useEffect(() => {
    const activeConversationHandler = async (conversation) => {
      if(conversation?.messages.length > 0) {
        try {
          const mostRecentMessage = conversation.messages[conversation.messages.length - 1]
          if (!mostRecentMessage.isRead && mostRecentMessage.senderId !== user.id) {
            const reqBody = {
              conversationId: conversation.id,
              senderId: user.id
            }
            await postRead(reqBody)
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    activeConversationHandler(conversation);
  }, [user, postRead, conversation])

  return (
    <Box className={classes.root}>
      {isConversation(conversation) && conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={conversation.messages}
                  otherUser={conversation.otherUser}
                  userId={user.id}
                />
                <Input
                  otherUser={conversation.otherUser}
                  conversationId={conversation.id || null}
                  user={user}
                  postMessage={postMessage}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
