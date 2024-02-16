// Import necessary modules from Remix
import { useActionData, Form,useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import NoteList from "../components/NoteList";
import { getAuth } from "@clerk/remix/ssr.server";
import { redirect } from "@remix-run/node";

const prisma = new PrismaClient();

export const loader = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  const allEntries = await prisma.notes.findMany();
  const notesFormatted = allEntries.map(entry => {
    // Deserialize the note field to obtain title and noteContent
    const noteObject = JSON.parse(entry.note);
    console.log('user id',userId)
    return {
      id: entry.id.toString(), // Ensure the id is a string to match the key prop expectation
      title: noteObject.title, // Extracted title from the note
      content: noteObject.noteContent, // Renamed noteContent to content to match NoteList's expectation
    };
  });
  return { entries: notesFormatted };
};


export const action = async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const noteContent = formData.get("note");
  
    try {
      // Construct the JSON object for the 'note' column
      const noteData = JSON.stringify({ title, noteContent });
  
      // Insert the note into the database
      const addedNote = await prisma.notes.create({
        data: {
          note: noteData // Storing serialized title and note
        },
      });
  
      // Manually serialize the addedNote object to handle BigInt serialization
      const addedNoteSanitized = {
        ...addedNote,
        id: addedNote.id.toString(), // Convert BigInt id to a string
      };
  
      return json({ success: true, addedNote: addedNoteSanitized });
    } catch (error) {
      console.error("Failed to add note:", error);
      // Send back a simplified error message to avoid BigInt serialization issues here as well
      return json({ success: false, error: "Failed to add note" });
    }
  };
  


export default function Notes() {
    const data = useActionData();
    const { entries: notes } = useLoaderData();

    
    return (
      <div className="bg-gradient-to-r from-violet-500 to-violet-700 min-h-screen flex flex-col items-center justify-center space-y-6 py-12">
          <Form method="post" className="bg-white p-8 rounded shadow-lg w-full max-w-md">
              <input
                  type="text"
                  name="title"
                  className="w-full mb-4 p-2 rounded border border-gray-300 text-sm"
                  placeholder="Title"
              />
              <textarea
                  name="note"
                  className="w-full mb-4 p-2 rounded border border-gray-300 text-sm"
                  placeholder="Note"
              ></textarea>
              <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">
                  Add Note
              </button>
          </Form>
          {data?.success && <p className="text-white text-xl text-center w-full">{data.addedNote.title} added!</p>}
          <div className="w-full px-4 flex justify-center">
              <NoteList notes={notes} />
          </div>
      </div>
  );
  
  
}
