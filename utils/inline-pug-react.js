import fs from 'fs';
import path from 'path';

export default function ({ types: t }) {
  return {
    visitor: {
      TaggedTemplateExpression(taggedPath) {
        function isReactPugReference(tag) {
          return t.isIdentifier(tag, { name: 'pugReact' });
        }
        const { node } = taggedPath;
        const { quasis, expressions } = node.quasi;
        if (isReactPugReference(node.tag) && quasis.length >= 1) {
          if (!expressions.length) {
            const value = quasis[0].value.raw;
            const filePath = path.resolve(path.dirname(this.file.parserOpts.sourceFileName), value);
            const content = fs.readFileSync(filePath, 'utf8');
            node.tag.name = 'pug';
            node.quasi.quasis[0].value.raw = content; // eslint-disable-line no-param-reassign
            const newNode = t.arrowFunctionExpression([t.identifier('props')], node);
            newNode.loc = node.loc;
            taggedPath.replaceWith(newNode);
          }
        }
      },
    },
  };
}
