import { blogs } from '@/data/blogs';

export default function sitemap() {
  const baseUrl = 'https://drbharatassam.com';

  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/blog',
    '/contact',
    '/appointment',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
