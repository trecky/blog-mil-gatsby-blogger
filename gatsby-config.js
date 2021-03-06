const config = require('./src/utils/siteConfig')
const path = require('path')
let bloggerConfig

try {
  bloggerConfig = require('./.blogger')
} catch (e) {
  bloggerConfig = {
    production: {
      apiKey: process.env.API_KEY,
      blogId: process.env.BLOG_ID,
    },
  }
} finally {
  const { apiKey, blogId } = bloggerConfig.production
  if (!apiKey || !blogId) {
    throw new Error('Blogger api key and blog id need to be provided.')
  }
}

let analyticsConfig

try {
  analyticsConfig = require('./.analytics')
} catch (e) {
  analyticsConfig = {
    production: {
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      viewId: process.env.VIEW_ID,
    },
  }
} finally {
  const { privateKey, clientEmail, viewId } = analyticsConfig.production
  if (!privateKey || !clientEmail || !viewId) {
    throw new Error(
      'Analytics private api key, client email and view id need to be provided.'
    )
  }
}

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    siteUrl: config.siteUrl,
    rssMetadata: {
      site_url: config.siteUrl,
      feed_url: config.siteUrl + config.siteRss,
      title_alt: config.siteTitleAlt,
      title: config.siteTitleAlt,
      description: config.siteDescription,
      image_url: `${config.siteUrl}${config.shareImage}`,
      image_url_width: config.shareImageWidth,
      image_url_height: config.shareImageHeight,
      author: config.author,
      copyright: config.copyright,
    },
    social: {
      twitter: config.userTwitter,
      fbAppID: config.siteFBAppID,
      siteFBAppIDAdmins: config.siteFBAppIDAdmins,
      fbPage: config.fbPage,
    },
    basePath: '/',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: config.siteUrl,
      },
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 650,
              backgroundColor: 'white',
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-plugin-catch-links`,
    {
      resolve: 'gatsby-source-blogger',
      options:
        process.env.NODE_ENV === 'development'
          ? bloggerConfig.development
          : bloggerConfig.production,
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: config.siteGTMID,
        includeInDevelopment: false,
      },
    },
    {
      resolve: `gatsby-source-google-analytics-reporting-api`,
      options:
        process.env.NODE_ENV === 'development'
          ? analyticsConfig.development
          : analyticsConfig.production,
    },
    'gatsby-plugin-sitemap',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleAlt,
        start_url: '/',
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: `static${config.siteLogo}`,
        icons: [
          {
            src: `${config.siteIcon}`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `${config.siteLogo}`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        setup(ref) {
          const ret = ref.query.site.siteMetadata.rssMetadata
          ret.allMarkdownRemark = ref.query.allMarkdownRemark
          ret.generator = config.siteTitle
          return ret
        },
        query: `
                {
                  site {
                    siteMetadata {
                      rssMetadata {
                        site_url
                        feed_url
                        title
                        description
                        image_url
                        author
                        copyright
                      }
                    }
                  }
                }
              `,
        feeds: [
          {
            serialize(ctx) {
              const rssMetadata = ctx.query.site.siteMetadata.rssMetadata
              return ctx.query.allMarkdownRemark.edges
                .filter(edge => edge.node.frontmatter.type === 'blogger__POST')
                .map(edge => ({
                  categories: edge.node.frontmatter.labels.split(','),
                  date: edge.node.frontmatter.date,
                  title: edge.node.frontmatter.title,
                  description: edge.node.excerpt,
                  author: rssMetadata.author,
                  url: rssMetadata.site_url + edge.node.frontmatter.slug,
                  guid: rssMetadata.site_url + edge.node.frontmatter.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                }))
            },
            query: `
                    {
                      allMarkdownRemark(
                        limit: 1000,
                        sort: { order: DESC, fields: [frontmatter___date] },
                      ) {
                        edges {
                          node {
                            excerpt(pruneLength: 400)
                            html
                            id
                            frontmatter {
                              slug
                              title
                              type
                              date(formatString: "MMMM DD, YYYY")
                              labels
                            }
                          }
                        }
                      }
                    }
                  `,
            output: config.siteRss,
            title: config.siteTitle,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: config.themeColor,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        develop: false,
        whitelist: [
          'header-logo',
          'post-related__prev',
          'post-related__next',
          'btn-social-counter--facebook',
          'btn-social-counter--rss',
          'btn-social-counter--twitter',
          'social-links__link--facebook',
          'social-links__link--twitter',
          'social-links__link--instagram',
          'btn-facebook',
          'btn-twitter',
          'tr-caption',
          'col-md-8',
          'slick-slider',
        ],
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: [`title`],
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            slug: node => node.frontmatter.slug,
          },
        },
      },
    },
    'gatsby-plugin-netlify',
  ],
}
