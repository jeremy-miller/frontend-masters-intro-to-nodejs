import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  findNotes,
  getAllNotes,
  newNote,
  removeAllNotes,
  removeNote,
} from "./notes.js";
import { listNotes } from "./utils.js";
import { start } from "./server.js";

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "Create a new note",
    (yargs) => {
      return yargs.positional("note", {
        type: "string",
        description: "The content of the created note",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.note, tags);
      console.log("Note created:", note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "Tags to add to the note",
  })
  .command(
    "all",
    "Get all notes",
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    "find <filter>",
    "Get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by. Will be applied to note.content.",
        type: "string",
      });
    },
    async (argv) => {
      const matches = await findNotes(argv.filter);
      listNotes(matches);
    }
  )
  .command(
    "remove <id>",
    "Remove note by ID",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The ID of the note to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      console.log("Note removed:", id);
    }
  )
  .command(
    "web [port]",
    "Launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    }
  )
  .command(
    "clean",
    "Remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("All notes removed");
    }
  )
  .demandCommand(1)
  .parse();
