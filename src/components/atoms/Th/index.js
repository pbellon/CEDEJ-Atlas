import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';

const Th = styled.th`
  padding-left: 2px;
  padding-right: 2px;
  text-align: ${({ align = 'center' }) => align};
  ${ifProp('width', css`
    width: ${({ width }) => width}px;          
  `, css`
    width: auto;
  `)}
`;

export default Th;
