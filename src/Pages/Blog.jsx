import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { ArrowRight, Calendar, User } from 'lucide-react'
import './Blog.css'
import '../utils/scrollAnimations.css'
import { 
  useScrollAnimation, 
  getAnimationClass,
  ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Blog() {
  const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero);
  const [blogRef, blogVisible] = useScrollAnimation(ANIMATION_CONFIGS.section);
  
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching blogs:', error)
    } else {
      setBlogs(data)
    }
    setLoading(false)
  }

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="blog-page">
      <header className="blog-hero" ref={heroRef}>
        <div className="container">
          <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>
            Our Blog
          </p>
          <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>
            Before We Led, We Learned Together
          </h1>
          <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
            Read about our latest activities and thoughts.
          </p>
        </div>
      </header>

      <main>
        <section className="blog-content-section" ref={blogRef}>
          <div className={`container ${getAnimationClass('fadeInUp', blogVisible)}`}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
                No blog posts available yet. Check back soon!
              </div>
            ) : (
              <div className="blog-grid">
                {blogs.map((blog) => (
                  <a 
                    href={blog.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="blog-card" 
                    key={blog.id}
                  >
                    <div className="blog-image-wrapper">
                      <img 
                        src={blog.image_url.startsWith('http') ? blog.image_url : supabase.storage.from('blog-images').getPublicUrl(blog.image_url).data.publicUrl} 
                        alt={blog.title} 
                        className="blog-image" 
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-content">
                      <h3 className="blog-title">{blog.title}</h3>
                      <div className="blog-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={14} /> {blog.author}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} /> {formatDate(blog.created_at)}
                        </span>
                      </div>
                      <p className="blog-excerpt">{blog.excerpt}</p>
                      <div className="blog-read-more">
                        Read Full Post <ArrowRight size={16} />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Blog
