
export const withThousandthPlace = (numberStr: string) => numberStr.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')