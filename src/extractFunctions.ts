export function extractObjective(input: string) {
  const cleanedInput = input.replace(/^\d+\.\s*/, '');

  const regex = /{([^}]+)}\s*(.*)/i;
  const match = cleanedInput.match(regex);

  if (match) {
    const [_, valueInsideBraces, restOfString] = match;
    return { valueInsideBraces, restOfString };
  }

  return { valueInsideBraces: '', restOfString: cleanedInput };
}

export function extractStep(input: string) {
  const regex = /^##\s*Krok(?::\s*([^{}]+))?\s*{([^}]+)}/i;
  const match = input.match(regex);

  if (match) {
    const textAfterColon = match[1] ? match[1].trim() : '';
    const valueInsideBraces = match[2].trim(); 

    return { textAfterColon, valueInsideBraces };
  } else {
    return { textAfterColon: '', valueInsideBraces: '' };
  }
}

export function extractMetadata(lines: string[]) {
  const metadata = {title: '', subtitle: '', week: undefined, publicationWeek: undefined, validation: false};
  let inMetadata = false;

  const keyMappings = {
    title: ["Title", "Nadpis"],
    subtitle: ["Subtitle", "Podnadpis"],
    week: ["Week", "Týždeň"],
    publicationWeek: ["Publication-week", "Týždeň-zverejnenia"],
    validation: ["Validation", "Validácia"]
  };

  lines.forEach(line => {
    if (line.trim() === "---") {
      inMetadata = !inMetadata;
      return;
    }

    if (inMetadata) {
      const match = line.match(/^([\wáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ-]+):\s*(.+)$/i);
      if (match) {
        const rawKey = match[1].trim();
        const value = match[2].trim();

        const standardizedKey = Object.keys(keyMappings).find(stdKey =>
          keyMappings[stdKey].some(alias => alias.toLowerCase() === rawKey.toLowerCase())
        );

        if (standardizedKey) {
          metadata[standardizedKey] = value;
        }
      }
      return;
    }
  });

  return metadata;
}

function extractGeneric(line: string, labelRegex: string) {
  const match = line.match(/^>\s*(.*)/);
  if (match) {
    const text = match[1].trim();
    if (!new RegExp(labelRegex, "i").test(text)) {
      return text;
    }
  }
}

export function extractTask(line: string) {
  return extractGeneric(line, "^(Úloha:|Task:)");
}

export function extractComment(line: string) {
  return extractGeneric(line, "^(Poznámka:|Comment:)");
}

export function extractWarning(line: string) {
  return extractGeneric(line, "^(Upozornenie:|Warning:)");
}

export function extractLecturer(line: string) {
  return extractGeneric(line, "^(Vyučujúci:|Lecturer:)");
}

export function extractExample(line: string) {
  const match = line.match(/^>\s*(.*)/);
  if (match) {
    const text = match[1].trim();
    const exampleMatch = text.match(/^(Príklad:|Example:)\s*(.*)/i);
    if (exampleMatch) {
      return {
        block: undefined,
        title: exampleMatch[2].trim()
      }
    }
    return { block: text, title: undefined };
  }
}

export function extractWrongExample(line: string) {
  const match = line.match(/^>\s*(.*)/);
  if (match) {
    const text = match[1].trim();
    const exampleMatch = text.match(/^(Nesprávny príklad:|Wrong example:)\s*(.*)/i);
    if (exampleMatch) {
      return {
        title: exampleMatch[2].trim(),
        block: undefined
      }
    }
    return { block: text, title: undefined };
  }
}

export function extractSolution(line: string) {
  return extractGeneric(line, "^(Riešenie:|Riešenie\\*:|Solution:|Solution\\*)");
}

export function extractResult(line: string) {
  return extractGeneric(line, "^(Výsledok:|Výsledok\\*:|Result:|Result\\*)");
}

export function isTableSeparator(line: string) {
  return /^\s*:?-+:?(?:\|:?-+:?)*\s*$/i.test(line);
}

export function checkForAsterix(line: string) {
  return line.includes("*");  
}

export function transformSyntax(lines: string[]) {
  const result = [];
  const stack = [];
  const keywordMap = {
    "Úloha": "task",
    "Riešenie": "solution",
    "Výsledok": "result",
    "Poznámka": "comment",
    "Upozornenie": "warning",
    "Vyučujúci": "lecturer",
    "Príklad": "example",
    "Nesprávny príklad": "wrongExample",
    "Task": "task", 
    "Solution": "solution",
    "Result": "result",
    "Comment": "comment",
    "Warning": "warning",
    "Lecturer": "lecturer",
    "Example": "example",
    "Wrong example": "wrongExample"
  };
  const codeBlockStart = '```';
  const mathBlockStart = '$$';
  let inMathBlock = false;
  let inCodeBlock = false;
  let currentCodeBlockContent = [];
  let currentMathBlockContent = [];

  function countIndent(line: string) {
    let count = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '>') {
        count++;
      } 
    }
    return count;
  }

  function removeIndent(line: string) {
    return line.replace(/^(\s*>\s*)+/, '').trim()
  }

  function splitByFirstColon(str: string) {
    const index = str.indexOf(':');
    if (index !== -1) {
      return [str.substring(0, index).trim(), str.substring(index + 1).trim()];
    } else {
      return [str.trim()];
    }
  }

  for (const line of lines) {
    const currentIndentLevel = countIndent(line);
    const lineContent = line.trim(); // Trim the whole line initially
    const contentWithoutIndent = removeIndent(lineContent);
    const parts = splitByFirstColon(contentWithoutIndent);
    const rawKeywordWithMaybeStar = parts[0];
    const remainingContent = parts.length > 1 ? parts[1] : '';

    if (contentWithoutIndent.startsWith(codeBlockStart)) {
      if (inCodeBlock) {
        const parent = stack.length > 0 ? stack[stack.length - 1].children : result;
        parent.push({ type: 'markdown', children: [], _markdownContent: currentCodeBlockContent.join('\n'), isCodeBlock: true });
        currentCodeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlockContent.push(contentWithoutIndent);
      continue;
    }

    // MATH
    if (contentWithoutIndent.startsWith(mathBlockStart)) {
      if (inMathBlock) {
        const parent = stack.length > 0 ? stack[stack.length - 1].children : result;
        parent.push({ type: 'markdown', children: [], _markdownContent: currentMathBlockContent.join('\n'), isMath: true });
        currentMathBlockContent = [];
        inMathBlock = false;
      } else {
        inMathBlock = true;
      }
      continue;
    }

    if (inMathBlock) {
      currentMathBlockContent.push(contentWithoutIndent);
      continue;
    }

    let rawKeyword = rawKeywordWithMaybeStar;
    let isHidden = false;
    if (rawKeywordWithMaybeStar.endsWith('*')) {
      rawKeyword = rawKeywordWithMaybeStar.slice(0, -1);
      isHidden = true;
    }

    const englishKeyword = keywordMap[rawKeyword];

    while (stack.length > currentIndentLevel) {
      stack.pop();
    }

    const parent = (stack.length > 0)
      ? stack[stack.length - 1].children 
      : result;

    if (englishKeyword) {
      const newBlock = { type: englishKeyword, props: {}, children: [] };

      if (isHidden && (englishKeyword === 'result' || englishKeyword === 'solution')) {
        newBlock.props.defaultHiddenValue = true;
      }

      let title = undefined;
      if ((englishKeyword === 'example' || englishKeyword === 'wrongExample') && remainingContent) {
        title = remainingContent;
      }

      if (title) {
        newBlock.props.exampleName = title;
      }

      parent.push(newBlock);
      stack.push(newBlock);

      if (remainingContent && 
        (englishKeyword !== 'example' && englishKeyword !== 'wrongExample')
      ) {
        const markdownBlock = { type: 'markdown', children: [], _markdownContent: remainingContent };
        newBlock.children.push(markdownBlock);
      }
    } else if (contentWithoutIndent) {
      const markdownBlock = { type: 'markdown', children: [], _markdownContent: contentWithoutIndent };
      parent.push(markdownBlock);
    }
  }

  return result;
}
