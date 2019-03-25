import { FacebookProvider, ShareButton } from 'react-facebook'
import configFacebook from '../../../../../utils/facebookConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const FacebookShare = ({ pagePath, icon, text }) => {
  return (
    <FacebookProvider appId={configFacebook.apiId}>
      <ShareButton
        className="btn btn-default btn-facebook btn-icon btn-block"
        href={'https://www.blogmil.net/' + pagePath}
      >
        <FontAwesomeIcon icon={icon} />
        <span className="post-sharing__label hidden-xs">{text}</span>
      </ShareButton>
    </FacebookProvider>
  )
}

export default FacebookShare
