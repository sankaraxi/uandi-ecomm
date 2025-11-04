import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ blog }) {
    return (
        <Link href={`/blogs/${blog.slug}`}>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {blog.featured_image && (
                    <div className="relative h-56 w-full overflow-hidden">
                        <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                        {blog.author_name && <span>{blog.author_name}</span>}
                        <span>•</span>
                        <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                        {blog.title}
                    </h3>
                    {blog.excerpt && (
                        <p className="text-gray-600 line-clamp-3 mb-4">{blog.excerpt}</p>
                    )}
                    <span className="text-purple-600 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
