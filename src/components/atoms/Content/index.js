import styled from 'styled-components';
import { font, palette } from 'styled-theme';

const Holder = styled.div``;

const Content = styled.div`
  max-width: 800px;
  margin: auto;
  padding-top: ${({noTopPadding})=>noTopPadding?0:50}px;
  padding-left: 15px;
  padding-right: 15px;
  font-family: ${ font('primary') };
  line-height: 1.5em;
  & h1 {
    font-size: 3.5em;
    margin-top: ${({noTopPadding})=>noTopPadding?0:'0.75em'};
  }

  & h2 {
    font-size: 2.2em;
  }

  a {
    color: ${palette('primary', 0)};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Content;
