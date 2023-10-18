import dbConnect from '@/utils/mongoConnect';
import ChatModel from '@/models/ChatModel';

export async function POST(request) {
  await dbConnect(); // connect to your DB
  // make a new chat
  let body = await request.json();
  console.log(body);
  const newChat = new ChatModel({
    message: body.message,
    sender: body.sender,
  });
  // save the chat
  await newChat.save();
  // return the chat
  return new Response('ok');
  return new Response(JSON.stringify(newChat));
}
