import React from 'react';

import StyleSheet from 'styled-components/lib/models/StyleSheet';
import PropTypes from 'prop-types';

const StyleWrapper = ({ children }) => {
  const sheet = StyleSheet.instance;
  const style = sheet.toHTML();
  return (
    <html lang="fr">
      <head dangerouslySetInnerHTML={{ __html: style }} />
      <body>
        { children }
      </body>
    </html>
  );
};

StyleWrapper.propTypes = {
  children: PropTypes.node,
};

export default StyleWrapper;
