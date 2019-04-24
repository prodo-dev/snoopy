export const matchAll = (regex: RegExp) => (str: string): string[] => {
  let m: RegExpExecArray | null;
  const matches: string[] = [];

  // tslint:disable-next-line:no-conditional-assignment
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach(match => {
      matches.push(match);
    });
  }

  return matches;
};
