// https://github.com/diegohaz/arc/wiki/Styling
import { reversePalette } from 'styled-theme/composer';

const theme = {};

theme.palette = {
  primary: [
    'rgb(221, 19, 19)',
    'rgb(216, 56, 56)',
    'rgb(151, 5, 5)',
    'rgb(240, 179, 179)',
    'rgb(151, 5, 5)',
    '#71bcf7',
    '#c2e2fb',
  ],
  secondary: ['#c2185b', '#e91e63', '#f06292', '#f8bbd0'],
  danger: ['#d32f2f', '#f44336', '#f8877f', '#ffcdd2'],
  alert: ['#ffa000', '#ffc107', '#ffd761', '#ffecb3'],
  success: ['#388e3c', '#4caf50', '#7cc47f', '#c8e6c9'],
  grayscale: ['#212121', '#616161', '#9e9e9e', '#bdbdbd', '#e0e0e0', '#eeeeee', '#ffffff'],
  white: ['#fff', '#fff', '#eee'],
};

theme.reversePalette = reversePalette(theme.palette);

theme.fonts = {
  primary: 'Open Sans, Roboto, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
  quote: 'Georgia, serif',
};


export default theme;
