import { RiAlertFill } from "react-icons/ri";
import { BlockNoteSchema, defaultBlockSpecs, insertOrUpdateBlock } from "@blocknote/core";
import { Introduction } from "./components/Introduction/Introduction";
import { Objectives } from "./components/Objectives/Objectives";
import { Step } from "./components/Step/Step";
import { Metadata } from "./components/Metadata/Metadata";
import { Summary } from "./components/Summary/Summary";
import { Resource } from "./components/Resources/Resources";
import { Task } from "./components/Task/Task";
import { Solution } from "./components/Solution/Solution";
import { Result } from "./components/Result/Result";
import { Comment } from "./components/Comment/Comment";
import { Warning } from "./components/Warning/Warning";
import { Lecturer } from "./components/Lecturer/Lecturer";
import { Example } from "./components/Example/Example";
import { WrongExample } from "./components/WrongExample/WrongExample";
import { AdditionalResources } from "./components/AdditionalResources/AdditionalResource";
import { AdditionalTasks } from "./components/AdditionalTasks/AdditionalTasks";

type Introduction = typeof schema.Block;
type Objectives = typeof schema.Block;
type Metadata = typeof schema.Block;
type Summary = typeof schema.Block;
type Step = typeof schema.Block;
type Resource = typeof schema.Block;
type Task = typeof schema.Block;
type Solution = typeof schema.Block;
type Result = typeof schema.Block;
type Comment = typeof schema.Block;
type Warning = typeof schema.Block;
type Lecturer = typeof schema.Block;
type Example = typeof schema.Block;
type WrongExample = typeof schema.Block;
type AdditionalResources = typeof schema.Block;
type AdditionalTasks = typeof schema.Block;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    introduction: Introduction,
    objectives: Objectives,
    metadata: Metadata,
    summary: Summary,
    step: Step,
    resource: Resource,
    task: Task,
    solution: Solution,
    result: Result,
    comment: Comment,
    warning: Warning,
    lecturer: Lecturer,
    example: Example,
    wrongExample: WrongExample,
    additionalResources: AdditionalResources,
    additionalTasks: AdditionalTasks
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

export const insertStep = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Step",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "step",
    });

    editor.focus()
  },
  aliases: [
    "step",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertResource = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Resource",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "resource",
      children: [
        {
          type: "bulletListItem",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "resource",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertAdditionalResource = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Additional Resources",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "additionalResources",
      children: [
        {
          type: "bulletListItem",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "resource",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertAdditionalTasks = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Additional Tasks",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "additionalTasks",
      children: [
        {
          type: "task",
          children: [
            {
              type: "paragraph",
              content: ""
            }
          ]
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "additionalTasks",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertTask = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Task",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "task",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "task",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertWarning = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Warning",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "warning",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "warning",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertSolution = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Solution",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "solution",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "solution",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertResult = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Result",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "result",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "result",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertComment = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Comment",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "comment",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "comment",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertLecturer = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Lecturer",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "lecturer",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "lecturer",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertExample = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Example",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "example",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "example",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});

export const insertWrongExample = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Wrong Example",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "wrongExample",
      children: [
        {
          type: "paragraph",
          content: ""
        }
      ]
    });

    editor.focus()
  },
  aliases: [
    "wrongExample",
  ],
  group: "KPIMark",
  icon: <RiAlertFill />,
});