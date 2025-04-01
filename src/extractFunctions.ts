export function extractObjective(input: string) {
  const regex = /{([^}]+)}\s*(.*)/i;
  const match = input.match(regex);

  if (match) {
    const valueInsideBraces = match[1];
    const restOfString = match[2];
    return { valueInsideBraces, restOfString };
  } else {
    return { valueInsideBraces: '', restOfString: input };
  }
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
    const exampleMatch = text.match(/^(Zlý príklad:|Wrong example:)\s*(.*)/i);
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
