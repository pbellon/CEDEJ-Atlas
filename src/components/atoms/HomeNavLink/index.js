import styled from 'styled-components';
import { palette } from 'styled-theme';
import NavLink from '../NavLink';

const HomeNavLink = styled(NavLink)`
  background-color: ${palette('white', 2)};
  color: ${palette('grayscale', 0)};
  &:hover:not(.active){
    background-color: ${palette('white', 0)};
  }
  &.active {
    color: #000;
    background-color: ${palette('grayscale', 4)};
  }
`;

export default HomeNavLink;
