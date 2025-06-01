const separatedText = (content: string): string[][] => {
    return content
        .split("\n")
        .filter((paragraph) => paragraph.trim())
        .map((paragraph) =>
            paragraph
                .split(/(?<=[.!?])\s+/)
                .map((sentence) => sentence.trim())
                .filter((sentence) => sentence)
        );
};

export default separatedText;
