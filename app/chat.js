'use client';
import { useEffect, useState } from 'react';
import { listenSSE } from 'nextcomet';

// Begin listening for changes to the database
// handleNewMessage is a callback that receives the changes
// "/api/SSE" is the API resource we setup in step
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const handleNewMessage = (message) => {
    switch (message.tag) {
      case 'insert': // <-- catch messages by tag defined in the API route
        console.log('New message: ', message);
        setMessages((messages) => [...messages, message]);
        break;
      case 'delete':
        console.log('Error: ', message);
        break;
    }
  };
  useEffect(() => {
    console.log('listening for messages');
    listenSSE(handleNewMessage, '/api/sse');
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { message, sender } = e.target;
    const body = {
      message: message.value,
      sender: sender.value,
    };
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    message.value = '';
    sender.value = '';
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="text-black">
        <input type="text" name="message" placeholder="message" />
        <input type="text" name="sender" placeholder="name" />
        <input type="submit" className="bg-slate-300 px-2 py-1 rounded-md" />
      </form>
      {messages.map((message, index) => (
        <div key={index}>
          <h3 className="text-gray-500">{message.message.sender}:</h3>
          <p>{message.message.message}</p>
        </div>
      ))}
    </div>
  );
}
// our message handling callback
