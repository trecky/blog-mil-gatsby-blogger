import React from 'react'
import HeaderTopBar from './HeaderTopBar'
import HeaderSecondary from './HeaderSecondary'
import HeaderPrimary from './HeaderPrimary'

const HeaderMobile = () => {
  return (
    <header className="header">
      <HeaderTopBar />
      <HeaderSecondary />
      <HeaderPrimary />
    </header>
  )
}

export default HeaderMobile