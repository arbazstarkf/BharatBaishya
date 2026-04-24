import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogs } from '@/data/blogs';
import styles from './blogDetail.module.css';
import ScrollRevealClient from '../../about/ScrollRevealClient';

// Next.js 15 requires async params matching RouteProps
export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return {};

  return {
    title: `${blog.title} | Dr. Bharat Baishya`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: new Date(blog.date).toISOString(),
      authors: [blog.author],
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    alternates: {
      canonical: `https://drbharatassam.com/blog/${blog.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) notFound();

  // Simple Markdown to HTML parser for the blog content
  // In a real app we might use a robust package like react-markdown
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      line = line.trim();
      if (!line) return null;
      if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
      if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
      if (line.match(/^\d+\. /)) return <li key={i}>{line.replace(/^\d+\. /, '')}</li>;
      
      // Inline styling
      let formattedLine = line;
      // Bold
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <>
      <article className={styles.article}>
        {/* Article Header */}
        <header className={styles.header}>
          <div className="container">
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <Link href="/">Home</Link> <span>/</span> <Link href="/blog">Blog</Link> <span>/</span> <span>Article</span>
            </nav>
            <div className={styles.category}>{blog.category}</div>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.meta}>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  <Image src="/images/doctor-portrait.png" alt={blog.author} width={50} height={50} />
                </div>
                <div className={styles.authorInfo}>
                  <strong>{blog.author}</strong>
                  <span>{blog.authorCredentials}</span>
                </div>
              </div>
              <div className={styles.metaInfo}>
                <span><i className="fa-regular fa-calendar"></i> {blog.date}</span>
                <span><i className="fa-regular fa-clock"></i> {blog.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container">
          <div className={styles.featuredImageWrap}>
            <Image
              src={blog.image}
              alt={blog.title}
              width={1000}
              height={500}
              className={styles.featuredImage}
              priority
            />
          </div>
        </div>

        {/* Article Body */}
        <div className={`container ${styles.layout}`}>
          <div className={styles.contentWrap}>
            <div className={styles.content}>
              {renderContent(blog.content)}
            </div>

            <div className={styles.share}>
              <h4>Share this article</h4>
              <div className={styles.shareButtons}>
                <button className={styles.shareBtn} aria-label="Share on Facebook"><i className="fa-brands fa-facebook-f"></i></button>
                <button className={styles.shareBtn} aria-label="Share on Twitter"><i className="fa-brands fa-twitter"></i></button>
                <button className={styles.shareBtn} aria-label="Share on LinkedIn"><i className="fa-brands fa-linkedin-in"></i></button>
                <button className={styles.shareBtn} aria-label="Share via WhatsApp"><i className="fa-brands fa-whatsapp"></i></button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={`card ${styles.sidebarCard}`}>
              <h3>About the Author</h3>
              <div className={styles.sidebarAuthor}>
                <Image src="/images/doctor-portrait.png" alt={blog.author} width={80} height={80} className={styles.sidebarAvatar} />
                <h4>{blog.author}</h4>
                <p>Consultant Physician & Diabetes Specialist with over 20 years of experience serving Assam.</p>
              </div>
              <Link href="/appointment" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                Book Appointment
              </Link>
            </div>

            <div className={`card ${styles.sidebarCard}`}>
              <h3>Recent Articles</h3>
              <div className={styles.recentList}>
                {blogs.filter(b => b.slug !== slug).slice(0, 3).map(recent => (
                  <Link href={`/blog/${recent.slug}`} key={recent.slug} className={styles.recentItem}>
                    <div className={styles.recentImgWrap}>
                      <Image src={recent.image} alt={recent.title} width={80} height={80} className={styles.recentImg} />
                    </div>
                    <div>
                      <h5>{recent.title}</h5>
                      <span>{recent.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
      
      {/* Article Schema for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: blog.title,
            description: blog.excerpt,
            author: {
              '@type': 'Physician',
              name: blog.author,
            },
            publisher: {
              '@type': 'MedicalBusiness',
              name: 'Dr. Bharat Baishya Clinic',
            },
            mainEntity: {
              '@type': 'Article',
              headline: blog.title,
              image: `https://drbharatassam.com${blog.image}`,
              datePublished: new Date(blog.date).toISOString(),
            }
          }),
        }}
      />
    </>
  );
}
