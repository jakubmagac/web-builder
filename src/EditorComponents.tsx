import { RiAlertFill } from "react-icons/ri";
import { BlockNoteSchema, defaultBlockSpecs, insertOrUpdateBlock } from "@blocknote/core";
import { Introduction } from "./components/Introduction/Introduction";
import { Objectives } from "./components/Objectives/Objectives";
import { Metadata } from "./components/Metadata/Metadata";
import { Summary } from "./components/Summary/Summary";

type Introduction = typeof schema.Block;
type Objectives = typeof schema.Block;
type Metadata = typeof schema.Block;
type Summary = typeof schema.Block;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    introduction: Introduction,
    objectives: Objectives,
    metadata: Metadata,
    summary: Summary,
  },
});

export const insertIntroduction = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Introduction",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "introduction",
    });

    editor.focus()
  },
  aliases: [
    "introduction",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertObjectives = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Objectives",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "objectives",
    });

    editor.focus()
  },
  aliases: [
    "objectives",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertMetadata = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Metadata",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "metadata",
    });

    editor.focus()
  },
  aliases: [
    "metadata",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertSummary = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Summary",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "summary",
    });

    editor.focus()
  },
  aliases: [
    "summary",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});
