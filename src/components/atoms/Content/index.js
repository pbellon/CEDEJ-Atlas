import styled from 'styled-components';
import { font, palette } from 'styled-theme';

const Content = styled.div`
  font-family: ${font('primary')};
  line-height: 1.5em;
  & h1 {
    font-size: 3.5em;
    margin-top: ${({ noTopPadding }) => noTopPadding ? 0 : '0.75em'};
  }

  & h2 {
    font-size: 2.2em;
  }
  p {
    text-align: justify;
  }
  a {
    color: ${palette('primary', 0)};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
  }
`;

export default Content;
