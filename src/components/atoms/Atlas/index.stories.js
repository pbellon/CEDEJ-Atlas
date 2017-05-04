import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Atlas from '.'

storiesOf('Atlas', module)
  .add('default', () => (
    <Atlas/>
  ))
