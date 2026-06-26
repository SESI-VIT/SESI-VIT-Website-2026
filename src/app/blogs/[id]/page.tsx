import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BlogsDetailNav } from '../blogsDetailNav'
import BlogsFooter from '../blogsFooter'
import { BlogsClientOnlyEffects } from '../blogsClientWrappers'
import '../blogs.css'
import { sanityFetch } from '@/sanity/lib/live'
import { BLOGS_QUERY, SINGLE_BLOG_QUERY } from '@/sanity/lib/queries'
import { getImageUrl } from '@/sanity/lib/image'
import { client } from '@/sanity/lib/client'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await client.fetch(
    BLOGS_QUERY,
    {},
    {
      perspective: 'published',
      stega: false,
      next: { revalidate: 60 }
    }
  ) as any[]
  return (posts || []).map((p: any) => ({ id: p._id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await client.fetch(
    SINGLE_BLOG_QUERY,
    { id },
    {
      stega: false,
      next: { revalidate: 60 }
    }
  ) as any
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | SESI Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await client.fetch(
    SINGLE_BLOG_QUERY,
    { id },
    {
      next: { revalidate: 60 }
    }
  ) as any
  if (!post) notFound()

  const allPosts = await client.fetch(
    BLOGS_QUERY,
    {},
    {
      next: { revalidate: 60 }
    }
  ) as any[]
  const related = (allPosts || []).filter((p: any) => p._id !== post._id).slice(0, 3)

  const postImgUrl = getImageUrl(post.img)
  const titleLower = (post.title || '').toLowerCase()
  const isGraphic = titleLower.includes('harnessing the power') || 
                    titleLower.includes('introduction to renewable') || 
                    titleLower.includes('from crisis to clean power')

  // Hero section styling overrides for graphics vs photos
  let heroBgColor = 'transparent';
  let heroTextColor = '#ffffff';
  let heroMetaColor = 'rgba(255, 255, 255, 0.5)';
  let heroDividerColor = 'rgba(255, 255, 255, 0.3)';
  let heroOverlayBg = 'linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, .4) 50%, transparent 100%)';
  let heroImgFilter = 'brightness(.55)';
  let categoryBadgeStyle: React.CSSProperties = {};

  if (titleLower.includes('harnessing the power') || titleLower.includes('introduction to renewable')) {
    heroBgColor = '#ffffff';
    heroTextColor = '#111111';
    heroMetaColor = 'rgba(0, 0, 0, 0.6)';
    heroDividerColor = 'rgba(0, 0, 0, 0.3)';
    heroOverlayBg = 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0) 70%)';
    heroImgFilter = 'none';
    if (post.category === 'Technology') {
      categoryBadgeStyle = { backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' };
    } else if (post.category === 'Education') {
      categoryBadgeStyle = { backgroundColor: 'rgba(21, 128, 61, 0.12)', color: '#15803d' };
    }
  } else if (titleLower.includes('from crisis to clean power')) {
    heroBgColor = '#000000';
    heroTextColor = '#ffffff';
    heroMetaColor = 'rgba(255, 255, 255, 0.7)';
    heroDividerColor = 'rgba(255, 255, 255, 0.4)';
    heroOverlayBg = 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 30%, rgba(0, 0, 0, 0) 70%)';
    heroImgFilter = 'none';
  }

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": postImgUrl.startsWith('http') ? postImgUrl : `${process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"}${postImgUrl}`,
    "datePublished": post.date, // ISO format or string date
    "author": {
      "@type": "Person",
      "name": post.author?.name || "SESI Member",
      "jobTitle": post.author?.role || "Writer",
      "description": post.author?.bio || ""
    },
    "publisher": {
      "@type": "Organization",
      "name": "SESI Student Chapter VIT Vellore",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"}/blogs/${post._id}`
    }
  };

  const inlineImages = post.inlineImages || []

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <BlogsClientOnlyEffects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <BlogsDetailNav />

      <div className="post-page">

        {/* ── HERO IMAGE ── */}
        <div className={`post-hero ${isGraphic ? 'is-graphic' : ''}`} style={{ backgroundColor: heroBgColor }}>
          <Image
            src={postImgUrl}
            alt={post.title}
            fill
            className="post-hero-img"
            style={{
              objectFit: isGraphic ? 'contain' : 'cover',
              objectPosition: postImgUrl.includes('cons') ? 'center bottom' : (isGraphic ? 'right center' : 'center'),
              filter: heroImgFilter
            }}
            unoptimized
            priority
          />
          <div className="post-hero-overlay" style={{ background: heroOverlayBg }}>
            <span className={`post-cat-badge cat-${post.category.toLowerCase()}`} style={categoryBadgeStyle}>{post.category}</span>
            <h1 className="post-title" style={{ color: heroTextColor }}>{post.title}</h1>
            <div style={{ marginTop: 24 }}>
              <Link href="/blogs" className="btn-primary-sm">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>

        {/* ── ARTICLE BODY ── */}
        <div className="post-body-wrap">

          {/* ── INLINE IMAGE 1 — shown before article body ── */}
          {inlineImages.length > 0 && (
            <div className="post-inline-img-wrap">
              <Image
                src={getImageUrl(inlineImages[0].src)}
                alt={inlineImages[0].caption || 'Inline Image'}
                width={780}
                height={420}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12 }}
                unoptimized
              />
              <p className="post-inline-caption">{inlineImages[0].caption}</p>
            </div>
          )}

          {/* Article text */}
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── INLINE IMAGES 2 & 3 — shown after article body ── */}
          {inlineImages.slice(1).map((img: any, i: number) => (
            <div key={i} className="post-inline-img-wrap">
              <Image
                src={getImageUrl(img.src)}
                alt={img.caption || 'Inline Image'}
                width={780}
                height={420}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12 }}
                unoptimized
              />
              <p className="post-inline-caption">{img.caption}</p>
            </div>
          ))}

          {/* ── AUTHOR CARD ── */}
          {post.author && (
            <div className="author-card">
              <div className="author-avatar-wrap">
                <Image
                  src={getImageUrl(post.author.avatar)}
                  alt={post.author.name}
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: '12px', width: 120, height: 120 }}
                  unoptimized
                />
              </div>
              <div className="author-info">
                <div className="author-label">Written by</div>
                <div className="author-name">{post.author.name}</div>
                <div className="author-role">{post.author.role}</div>
                <p className="author-bio">{post.author.bio}</p>
              </div>
            </div>
          )}

          {/* Read on SESI.org.in */}
          {post.externalLink && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #2A2A2A' }}>
              <a
                href={post.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="post-external-btn"
              >
                Read on SESI.org.in ↗
              </a>
            </div>
          )}
        </div>

        {/* ── RELATED POSTS ── */}
        <div className="related-section">
          <h2>More from SESI</h2>
          <div className="related-grid">
            {related.map((p: any) => {
              const relatedImgUrl = getImageUrl(p.img)
              const isRelatedGraphic = relatedImgUrl.includes('photovoltaic') || relatedImgUrl.includes('image-2-1') || relatedImgUrl.includes('arnav');
              let relatedBgColor = '#1a1a1a';
              if (relatedImgUrl.includes('photovoltaic') || relatedImgUrl.includes('image-2-1')) {
                relatedBgColor = '#ffffff';
              } else if (relatedImgUrl.includes('arnav')) {
                relatedBgColor = '#000000';
              }
              const relatedCatClass = `cat-${p.category.toLowerCase()}`
              
              return (
                <Link
                  key={p._id}
                  href={`/blogs/${p._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="blog-card visible" style={{ opacity: 1, transform: 'none' }}>
                    <div className="card-thumb" style={{ backgroundColor: relatedBgColor }}>
                      <Image
                        src={relatedImgUrl}
                        alt={p.title}
                        width={400}
                        height={160}
                        style={{
                          objectFit: isRelatedGraphic ? 'contain' : 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                        unoptimized
                      />
                    </div>
                    <div className="card-body">
                      <span className={`card-cat ${relatedCatClass}`}>{p.category}</span>
                      <div className="card-title">{p.title}</div>
                      <div className="card-excerpt">{p.excerpt}</div>
                      <span className="btn-read-card">Read More →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>

      <BlogsFooter />
    </div>
  )
}
