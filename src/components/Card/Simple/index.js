import React from 'react'
import { Link } from 'gatsby'
const slugify = require('slugify')

const Card = ({ labels, featuredImage, childMarkdownRemark, ...props }) => {
  const { title, date, slug } = childMarkdownRemark.frontmatter

  const path = props.basePath ? props.basePath : ''

  function strToSlug(str) {
    return slugify(str, {
      lower: true,
    })
  }

  return (
    <li className="posts__item posts__item--category-1">
      <figure className="posts__thumb">
        <Link to={`${path}${slug}`}>
          <img src={featuredImage.childImageSharp.fixed.srcWebp} />
        </Link>
      </figure>
      <div className="posts__inner">
        <div className="posts__cat">
          {labels.slice(0, 2).map((label) => (
            <Link key={label} to={'/' + strToSlug(label)}>
              <span className="label posts__cat-label mr-1 mb-1">{label}</span>
            </Link>
          ))}
        </div>
        <h6 className="posts__title">
          <Link to={`${path}${slug}`}>{title}</Link>
        </h6>
        <time dateTime="2016-08-23" className="posts__date">
          {date}
        </time>
      </div>
    </li>
  )
}

export default Card
