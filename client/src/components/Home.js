import React, { useCallback, useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { SidebarContainer } from "../components/Sidebar";
import { ActiveChat } from "../components/ActiveChat";
import { SocketContext } from "../context/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post("/api/messages", body);
    return data;
  };

  const saveRead = async (body) => {
    const { data } = await axios.put("/api/messages/read-status", body);
    return data;
  }

  const sendMessage = (data, body) => {
    socket.emit("new-message", {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
      readStatus: false
    });
  };

  const sendRead = (data) => {
    socket.emit("mark-read", {
      conversationId: data.message.conversationId,
      senderId: user.id
    });
  }

  const postMessage = async (body) => {
    try {
      const data = await saveMessage(body);
      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }
      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const postRead = async (body) => {
    try{
      if(body.conversationId){
        const data = await saveRead(body);
        markConvoAsRead(body);
        sendRead(data)
      }
    } catch(error) {
      console.error(error)
    }
  }

  const addNewConvo = useCallback(
    (recipientId, message) => {
      let newConversations = conversations.map((convo, i) => {
        if (convo.otherUser.id === recipientId) {
          const tempCopy = {...convo,
            id: message.conversationId,
            latestMessageText: message.text,
            unreadMessageCount: 1,
            messages: [...convo.messages]
          };
          tempCopy.messages.push(message);
          return  tempCopy;
        } else {
          return convo;
        }
      });
      // Reordering messages based on the recipient ID
      newConversations.forEach((convo, i) => {
        if(convo.otherUser.id === recipientId){
          newConversations.splice(i, 1);
          newConversations.unshift(convo)
        }
      });
      setConversations(newConversations);
    },
    [setConversations, conversations],
  );

  const addMessageToConversation = useCallback(
      (data) => {
        // if sender isn't null, that means the message needs to be put in a brand new convo
        const { message, sender = null } = data;
        if (sender !== null) {
          const newConvo = {
            id: message.conversationId,
            unreadMessageCount: 1,
            latestMessageText: message.text,
            otherUser: sender,
            messages: [message],
          };
          setConversations((prev) => [newConvo, ...prev]);
        } else {
          let updatedConversations = conversations.map((convo) => {
            if (convo.id === message.conversationId) {
              const tempCopy = {
                ...convo,
                latestMessageText: message.text,
                unreadMessageCount: (convo.otherUser.username !== activeConversation) ? (convo.unreadMessageCount += 1) : 0,
                messages: [...convo.messages]
              };
              tempCopy.messages.push(message);
              return tempCopy;
            } else {
              return convo;
            }
          });
          // Reordering the messages based on the most recent conversation if there is more than one conversation.
          if(updatedConversations.length > 1) {
            updatedConversations.forEach((convo, i) => {
              if(convo.id === message.conversationId){
                updatedConversations.splice(i, 1);
                updatedConversations.unshift(convo);
              }
            })
          }
          setConversations(updatedConversations);
        }
      },
      [ activeConversation, setConversations, conversations],
  );

  const markConvoAsRead = useCallback((data) => {
    const { conversationId } = data;
    const readConversations = conversations.map((convo) => {
      if(convo.id === conversationId){
        let tempCopy = {...convo, messages: [...convo.messages]}
        let numMessages = tempCopy.messages.length
        tempCopy.messages[(numMessages > 0 ? numMessages : 1) - 1].isRead = true;
        if(numMessages > 1){
          for(let i = numMessages-2; i >= 0; i--){
            if(tempCopy.messages[i].isRead){
              tempCopy.messages[i].isRead = false;
              break;
            }
          }
        }
        return tempCopy;
      } else {
        return convo;
      }
    });
    setConversations(readConversations);
  }, [conversations, setConversations])

  const setActiveChat = (username) => {
    setActiveConversation(username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      }),
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      }),
    );
  }, []);

  // Lifecycle
  useEffect(() => {
    // Socket init
    socket.on("add-online-user", addOnlineUser);
    socket.on("remove-offline-user", removeOfflineUser);
    socket.on("new-message", addMessageToConversation);
    socket.on("mark-read", markConvoAsRead)

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("add-online-user", addOnlineUser);
      socket.off("remove-offline-user", removeOfflineUser);
      socket.off("new-message", addMessageToConversation);
      socket.off("mark-read", markConvoAsRead)
    };
  }, [addMessageToConversation, markConvoAsRead, addOnlineUser, removeOfflineUser, socket]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push("/login");
      else history.push("/register");
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get("/api/conversations");
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
          postRead={postRead}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
          postRead={postRead}
        />
      </Grid>
    </>
  );
};

export default Home;
