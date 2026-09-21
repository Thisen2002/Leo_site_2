import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Trash2, X, UploadCloud } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching gallery:', error)
    } else {
      setImages(data)
    }
    setLoading(false)
  }

  const handleOpenModal = () => {
    setSelectedFiles([])
    setUploadProgress(0)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFiles([])
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
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
        .from('gallery-images')
        .upload(filePath, compressedFile)

      if (error) throw error
      return data.path
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadedPaths = []
      
      // Upload one by one to track progress and not overload the browser worker
      for (let i = 0; i < selectedFiles.length; i++) {
        const path = await compressAndUploadImage(selectedFiles[i])
        if (path) uploadedPaths.push({ image_url: path })
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      }

      // Insert all paths into the gallery table
      if (uploadedPaths.length > 0) {
        const { error } = await supabase
          .from('gallery')
          .insert(uploadedPaths)
          
        if (error) throw error
      }

      handleCloseModal()
      fetchGallery() // Refresh list
    } catch (error) {
      console.error('Error saving gallery images:', error)
      alert('Failed to save some images.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    try {
      // 1. Delete from DB
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // 2. Delete from Bucket
      if (imagePath && !imagePath.startsWith('/Pic/')) {
        await supabase.storage
          .from('gallery-images')
          .remove([imagePath])
      }

      fetchGallery()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image.')
    }
  }

  return (
    <div className="manage-gallery">
      <div className="manager-header">
        <h2>Manage Gallery</h2>
        <button className="add-btn" onClick={handleOpenModal}>
          <UploadCloud size={18} />
          Upload Images
        </button>
      </div>

      <div className="gallery-grid-admin" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {loading ? (
          <div style={{ color: '#94a3b8', gridColumn: '1 / -1' }}>Loading gallery...</div>
        ) : (
          images.map((img) => (
            <div key={img.id} style={{ 
              position: 'relative', 
              borderRadius: '12px', 
              overflow: 'hidden',
              aspectRatio: '1',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
              <img 
                src={supabase.storage.from('gallery-images').getPublicUrl(img.image_url).data.publicUrl} 
                alt="Gallery" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => handleDelete(img.id, img.image_url)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Images</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group" style={{ 
                  border: '2px dashed rgba(255,255,255,0.2)', 
                  padding: '3rem 2rem', 
                  textAlign: 'center',
                  borderRadius: '12px'
                }}>
                  <UploadCloud size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                  <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Select photos to upload</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Files will be automatically compressed before uploading.
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    style={{ 
                      background: 'transparent', 
                      border: 'none',
                      color: 'white'
                    }} 
                  />
                  {selectedFiles.length > 0 && (
                    <p style={{ color: '#4ade80', marginTop: '1rem' }}>
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                {uploading && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span>Compressing & Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal} disabled={uploading}>Cancel</button>
                <button type="submit" className="save-btn" disabled={uploading || selectedFiles.length === 0}>
                  {uploading ? 'Processing...' : 'Upload All'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageGallery
