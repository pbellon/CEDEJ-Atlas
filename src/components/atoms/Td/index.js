import styled from 'styled-components';

const Td = styled.td`
  padding-left: 2px;
  padding-right: 2px;
  text-align: ${({ align = 'center' }) => align};
`;

export default Td;
