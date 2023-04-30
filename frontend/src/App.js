import './App.css';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Box from '@mui/material/Box';
import { Button, Container, TextField, Typography } from '@mui/material';


function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [timerOut, setTimerOut] = useState(null);

  useEffect(() => {
    setSocket(io('http://localhost:5000'));
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket.on('message-from-server', (data) => {
      setChat(prev => {
        return [...prev, {
          message: data.message,
          receiver: true
        }]
      });
    });


    // typing start event
    socket.on("typing-started-from-server", () => setIsTyping(true));
    socket.on("typing-stoped-from-server", () => setIsTyping(false));

  }, [socket])

  const changeHandler = (e) => {
    setMessage(e.target.value);
    socket.emit("typing-started");

    if (timerOut) clearTimeout(timerOut);
    setTimerOut(setTimeout(() => {
      socket.emit("typing-stoped");
    }, 1000));

  }

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("message", message)
    socket.emit('send-message', {
      message
    });
    setChat(prev => {
      return [...prev, {
        message: message,
        receiver: false
      }]
    });
    setMessage("")
  }

  return (
    <Container>
      {chat.map((ele) => {
        return <Typography sx={{ textAlign: ele.receiver? 'left' : 'right' }} key={ele.message}>{ele.message}</Typography>
      })}

      {isTyping ? 'typing' : ""}
      <Box 
        component="form"
        onSubmit={submitHandler}
      >
        <TextField
          label="Write your message"
          variant='standard'
          size='small'
          value={message}
          onChange={changeHandler}
        />
        <Button type='submit' variant='contained' >Send</Button>
      </Box>
    </Container>
  );
}

export default App;
