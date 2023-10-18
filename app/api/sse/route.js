// app/api/SSE/route.ts
import longPoll, { poller, PollLogger } from 'nextcomet';
import dbConnect from '@/utils/mongoConnect';
import ChatModel from '@/models/ChatModel';
export const dynamic = 'api';
export async function GET() {
  await dbConnect(); // connect to your DB

  // Define polling settings
  const pollSettings = {
    model: ChatModel, //<-- Mongoose Model

    //Event will run on DB insert
    insert: (notify, change) => {
      notify.log({
        tag: 'insert', // <-- tag messages however you'd like for the frontend
        message: {
          message: change.fullDocument.message,
          sender: change.fullDocument.sender,
        },
        id: change.fullDocument._id,
      });
    },
    //Event will run on DB delete
    delete: (notify, change) => {
      notify.log({
        tag: 'delete',
        message: 'Chat deleted',
        id: change.documentKey._id,
      });
    },
  };

  const responseStream = new TransformStream();
  poller(responseStream, pollSettings);
  return longPoll(responseStream);
}
