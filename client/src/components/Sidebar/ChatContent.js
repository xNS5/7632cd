import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "180px"
  },
  previewWrapper: {
    display: "flex"
  },
  unread: {
    fontWeight: "bold",
    color: "#000000"
  },
  unreadCircle: {
    height: 20,
    width: 20,
    backgroundColor: "#2a9df4",
    borderRadius: "50%",
    display: "inline-block",
    marginLeft: 15,
    textAlign: "center"
  },
  unreadCount: {
    textAlign: "center",
    color: "white",
    marginTop: 10,
  }
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const countUnread = () => {
    let count = 0;
    const messages = conversation.messages;
    for(let i = messages.length-1; i >= 0 && messages[i].senderId === otherUser.id && messages[i].readStatus === false; i--){
      count+=1;
    }
    return count;
  }

  const unread = countUnread();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <div className={classes.previewWrapper}>
          <Typography className={`${classes.previewText} ${unread > 0 ? classes.unread : ""}`}>
            {latestMessageText}
          </Typography>
          {unread > 0 ?
              <span className={classes.unreadCircle}>
                  <span className={classes.unreadCount}>{unread}</span>
              </span>
              :
              null}
        </div>
      </Box>
    </Box>
  );
};

export default ChatContent;
