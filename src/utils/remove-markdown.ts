import { remark } from 'remark';
import stripMarkdown from 'strip-markdown';

export function removeMarkdown(text: string) {
  return (
    remark()
      .use(stripMarkdown)
      // Removing the markdown
      .processSync(text)
      // Converting back to string
      .toString()
      // Replacing the escaped characters
      .replace(/\\([_*\\])/, '$1')
  );
}
