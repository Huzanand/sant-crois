function TruncateText(text: string, maxChars: number, ellipsis = '...') {
    if (text.length <= maxChars) return text;

    // Обрезаем точно по символам (включая эллипсис)
    const ellipsisLength = ellipsis.length;
    const truncPosition = maxChars - ellipsisLength;

    return text.substring(0, Math.max(0, truncPosition)) + ellipsis;
}

export default TruncateText