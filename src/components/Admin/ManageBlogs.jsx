import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    author: '',
    excerpt: '',
    external_link: '',
    image_url: ''
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) {
      console.error('Error fetching blogs:', error)
    } else {
      setBlogs(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setFormData({ ...blog })
      setIsEditing(true)
    } else {
      setFormData({
        id: null,
        title: '',
        author: '',
        excerpt: '',
        external_link: '',
        image_url: ''
      })
      setIsEditing(false)
    }
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, title: '', author: '', excerpt: '', external_link: '', image_url: '' })
    setSelectedFile(null)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const compressAndUploadImage = async (file) => {
    const options = {
      maxSizeMB: 0.3, 
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      const fileExt = compressedFile.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, compressedFile, { upsert: true })

      if (error) throw error
      return data.path
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let finalImagePath = formData.image_url

      if (selectedFile) {
        const uploadedPath = await compressAndUploadImage(selectedFile)
        if (uploadedPath) {
          finalImagePath = uploadedPath
        }
      }

      const blogData = {
        title: formData.title,
        author: formData.author,
        excerpt: formData.excerpt,
        external_link: formData.external_link,
        image_url: finalImagePath
      }

      if (isEditing) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', formData.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData])
          
        if (error) throw error
      }

      handleCloseModal()
      fetchBlogs() 
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Failed to save blog.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return

    try {
      const { error: dbError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (imagePath && !imagePath.startsWith('http')) {
        await supabase.storage
          .from('blog-images')
          .remove([imagePath])
      }

      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog.')
    }
  }

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Blogs</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="add-btn" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add New Blog Link
          </button>
        </div>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading blogs...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>
                    <a href={blog.external_link} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
                      View Post
                    </a>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(blog)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(blog.id, blog.image_url)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>No blogs found. Add one above!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Blog Link' : 'Add New Blog Link'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="form-group">
                  <label>Author</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>Excerpt (Short Description)</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>External Link (Blogspot URL)</label>
                  <input type="url" value={formData.external_link} onChange={(e) => setFormData({...formData, external_link: e.target.value})} required placeholder="https://..." />
                </div>

                <div className="form-group">
                  <label>Cover Image (Will be automatically compressed)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {isEditing && !selectedFile && formData.image_url && (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Current image path: {formData.image_url} (Leave file input blank to keep this)
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {uploading ? 'Saving...' : 'Save Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBlogs
