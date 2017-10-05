import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Link } from 'components';

const customRenderers = {
  Link
};

const Markdown = ({ ...props }) => (
  <ReactMarkdown renderers={customRenderers} {...props} />
);

export default Markdown;
