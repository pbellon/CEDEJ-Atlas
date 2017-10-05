import styled from 'styled-components';

const getFontSize = ({
  desert: {
    properties: {
      scalerank,
    },
  },
}) => {
  switch (scalerank) {
    case 1: return '2em';
    case 2: return '1.5em';
    case 3: return '1.25em';
    default: return '1em';
  }
};


const textBorders = [
  '0.01em 0 1px #FFF',
  '-0.01em 0 1px #FFF',
  '0 0.01em 1px #FFF',
  '0 -0.01em 1px #FFF',
  '0.01em 0.01em 1px #FFF',
  '-0.01em -0.01em 1px #FFF',
].join(', ');

const DesertName = styled.span`
  font-size: ${getFontSize};
  text-shadow: ${textBorders}; 
  font-style: italic;
`;

export default DesertName;
