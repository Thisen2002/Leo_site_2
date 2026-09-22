import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageHero() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching hero images:', error)
    } else {
      setImages(data)
    }
    setLoading(false)
  }

  const handleOpenModal = () => {
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
        .from('hero-images')
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
    if (!selectedFile) {
        alert("Please select an image file to upload.")
        return
    }

    setUploading(true)

    try {
      const uploadedPath = await compressAndUploadImage(selectedFile)
      if (!uploadedPath) {
          setUploading(false)
          return
      }

      const dbData = {
        image_url: uploadedPath
      }

      const { error } = await supabase
        .from('hero_images')
        .insert([dbData])
        
      if (error) throw error

      handleCloseModal()
      fetchImages()
    } catch (error) {
      console.error('Error saving hero image:', error)
      alert('Failed to save hero image.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) return

    try {
      const { error: dbError } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (imageUrl && !imageUrl.startsWith('/Pic/')) {
        await supabase.storage
          .from('hero-images')
          .remove([imageUrl])
      }

      fetchImages()
    } catch (error) {
      console.error('Error deleting hero image:', error)
      alert('Failed to delete hero image.')
    }
  }

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Hero Section Images</h2>
        <button className="add-btn" onClick={handleOpenModal}>
          <Plus size={18} />
          Add Image
        </button>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading hero images...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image Preview</th>
                <th>Image Path</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id}>
                  <td>
                    <div style={{ 
                      width: '120px', height: '60px', borderRadius: '4px', overflow: 'hidden',
                      background: 'rgba(255,255,255,0.1)'
                    }}>
                      <img 
                        src={img.image_url.startsWith('/Pic/') ? img.image_url : supabase.storage.from('hero-images').getPublicUrl(img.image_url).data.publicUrl} 
                        alt="Hero" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { 
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;">Image Error</div>'
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{img.image_url}</span>
                  </td>
                  <td>{new Date(img.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn delete-btn" onClick={() => handleDelete(img.id, img.image_url)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {images.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No hero images found. Add one to get started.
                  </td>
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
              <h3>Add New Hero Image</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Photo (Will be automatically compressed)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required
                  />
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Recommended size: 1920x1080 for best quality on desktop monitors.
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageHero
