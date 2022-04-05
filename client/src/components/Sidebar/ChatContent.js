import React from "react";
import {Badge, Box, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
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
    maxWidth: "150px"
  },
  previewWrapper: {
    display: "flex",
    maxWidth: "200px",
  },
  unread: {
    fontWeight: "bold",
    color: "#000000"
  },
  unreadCountWrapper: {
    textAlign: "center",
    width: "fit-content",
    padding: "1em 2em"
  }
}));

const ChatContent = ({ conversation, unreadMessageCount }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Box className={classes.previewWrapper}>
          <Typography className={`${classes.previewText} ${unreadMessageCount > 0 ? classes.unread : ""}`}>
            {latestMessageText}
          </Typography>
        </Box>
      </Box>
      {unreadMessageCount > 0 &&
        <span className={classes.unreadCountWrapper}>
            <Badge badgeContent={unreadMessageCount} color={"primary"} showZero={false}/>
        </span>
      }
    </Box>
  );
};

export default ChatContent;
