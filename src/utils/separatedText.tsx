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

                // Add text before the tooltip, and split it into sentences
                const before = paragraph.slice(lastIndex, start).trim();
                if (before) {
                    const sentences = before
                        .split(/(?<=[.!?])\s+/)
                        .map((s) => s + " ");
                    pieces.push(...sentences.map((s) => s.trim()));
                }

                // Add the whole tooltip as one block
                pieces.push(match[0].trim());

                lastIndex = end;
            }

            // Add remaining text after last tooltip
            const after = paragraph.slice(lastIndex).trim();
            // console.log(after);
            if (after) {
                const sentences = after.split(/(?<=[.!?])\s+/).map((s) => s);
                pieces.push(...sentences.map((s) => s.trim()));
            }

            return pieces.filter(Boolean);
        });
};

export default separatedText;
