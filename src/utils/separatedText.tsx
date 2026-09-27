const separatedText = (content: string): string[][] => {
  const tooltipRegex = /<\[(.*?)\]\{(.*?)\}>/gs;

  return content
    .split("\n")
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => {
      const pieces: string[] = [];
      let lastIndex = 0;

      for (const match of paragraph.matchAll(tooltipRegex)) {
        const start = match.index!;
        const end = start + match[0].length;

        const before = paragraph.slice(lastIndex, start);
        if (before) {
          const sentences = before.match(/[^.!?]+[.!?]?\s*/g);
          if (sentences) {
            pieces.push(...sentences);
          }
        }

        pieces.push(match[0]);

        lastIndex = end;
      }

      const after = paragraph.slice(lastIndex);
      if (after) {
        const sentences = after.match(/[^.!?]+[.!?]?\s*/g);
        if (sentences) {
          pieces.push(...sentences);
        }
      }

      return pieces.map((p) => p).filter((p) => p.trim() !== "");
    });
};

export default separatedText;
