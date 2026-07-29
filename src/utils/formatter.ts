import { DelimiterType, FormatOptions } from '../types';

export function getDelimiterChar(type: DelimiterType, customChar: string = ','): string | RegExp {
  switch (type) {
    case 'comma':
      return ',';
    case 'newline':
      return '\n';
    case 'space':
      return ' ';
    case 'semicolon':
      return ';';
    case 'dash':
      return '-';
    case 'custom':
      return customChar || ',';
    default:
      return ',';
  }
}

export function parseItems(text: string, delimiterType: DelimiterType, customChar: string = ','): string[] {
  if (!text || !text.trim()) return [];

  let items: string[] = [];

  if (delimiterType === 'newline') {
    items = text.split('\n');
  } else if (delimiterType === 'comma') {
    // Split by comma or Arabic comma (،)
    items = text.split(/[,،]/);
  } else if (delimiterType === 'semicolon') {
    items = text.split(/;؛/);
  } else if (delimiterType === 'space') {
    items = text.split(/\s+/);
  } else if (delimiterType === 'dash') {
    items = text.split('-');
  } else {
    items = text.split(customChar || ',');
  }

  return items;
}

export function processAndFormatText(
  text: string,
  delimiterType: DelimiterType,
  options: FormatOptions,
  customChar: string = ','
): { formattedText: string; items: string[]; count: number } {
  if (!text) {
    return { formattedText: '', items: [], count: 0 };
  }

  let rawItems = parseItems(text, delimiterType, customChar);

  if (options.trimItems) {
    rawItems = rawItems.map(item => item.trim());
  }

  // Filter out completely empty items if trimming
  let cleanItems = rawItems.filter(item => item.length > 0);

  if (options.removeDuplicates) {
    cleanItems = Array.from(new Set(cleanItems));
  }

  if (options.sortItems) {
    cleanItems.sort((a, b) => {
      // Check if both are numbers
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  // Join back or format according to outputFormat
  let result = '';
  const glue = delimiterType === 'newline' ? '\n' : (delimiterType === 'comma' ? ', ' : ' ');

  switch (options.outputFormat) {
    case 'json':
      result = JSON.stringify(cleanItems, null, 2);
      break;
    case 'sql':
      result = cleanItems.map(i => `'${i.replace(/'/g, "''")}'`).join(', ');
      break;
    case 'bullet':
      result = cleanItems.map(i => `• ${i}`).join('\n');
      break;
    case 'plain':
    default:
      result = cleanItems.join(glue);
      break;
  }

  return {
    formattedText: result,
    items: cleanItems,
    count: cleanItems.length,
  };
}
