import styled from 'styled-components';

const Th = styled.th`
  padding-left: 2px;
  padding-right: 2px;
  text-align: ${({ align='center' }) => align};
`;

export default Th; 
