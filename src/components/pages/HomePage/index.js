import React from 'react'

import { PageTemplate, Header, Hero, Footer, FeatureList } from 'components'
import { Prototype } from 'containers';

const HomePage = () => {
  return (
    <PageTemplate header={<Header />} footer={<Footer />}>
      <Prototype />
    </PageTemplate>
  )
}

export default HomePage
