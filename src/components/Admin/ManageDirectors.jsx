import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageDirectors() {
  const [directors, setDirectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    id: null,
    avenue: '',
    name: '',
    position: '',
    email: '',
    linkedin: '',
    image_url: ''
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('avenue_directors')
      .select('*')
      .order('id', { ascending: true }) // Maintains natural order
    
    if (error) {
      console.error('Error fetching directors:', error)
    } else {
      setDirectors(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (director = null) => {
    if (director) {
      setFormData(director)
      setIsEditing(true)
    } else {
      setFormData({
        id: null,
        avenue: '',
        name: '',
        position: '',
        email: '',
        linkedin: '',
        image_url: ''
      })
      setIsEditing(false)
    }
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, avenue: '', name: '', position: '', email: '', linkedin: '', image_url: '' })
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
        .from('bod-images')
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

      const dbData = {
        avenue: formData.avenue,
        name: formData.name,
        position: formData.position,
        email: formData.email,
        linkedin: formData.linkedin,
        image_url: finalImagePath
      }

      if (isEditing) {
        const { error } = await supabase
          .from('avenue_directors')
          .update(dbData)
          .eq('id', formData.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('avenue_directors')
          .insert([dbData])
        if (error) throw error
      }

      handleCloseModal()
      fetchDirectors()
    } catch (error) {
      console.error('Error saving director:', error)
      alert('Failed to save director.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this director?')) return

    try {
      const { error: dbError } = await supabase
        .from('avenue_directors')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (imagePath && !imagePath.startsWith('/Pic/')) {
        await supabase.storage
          .from('bod-images')
          .remove([imagePath])
      }

      fetchDirectors()
    } catch (error) {
      console.error('Error deleting director:', error)
      alert('Failed to delete director.')
    }
  }

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Avenue Directors</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Director
        </button>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading directors...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Avenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((director) => (
                <tr key={director.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                        background: 'rgba(255,255,255,0.1)'
                      }}>
                        {director.image_url ? (
                          <img 
                            src={director.image_url.startsWith('/Pic/') ? director.image_url : supabase.storage.from('bod-images').getPublicUrl(director.image_url).data.publicUrl} 
                            alt={director.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40/1e3c72/ffffff?text=' + director.name.charAt(0) }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            {director.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {director.name}
                    </div>
                  </td>
                  <td>{director.position}</td>
                  <td>{director.avenue}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(director)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(director.id, director.image_url)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Director' : 'Add New Director'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Avenue</label>
                    <input type="text" value={formData.avenue} onChange={(e) => setFormData({...formData, avenue: e.target.value})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Position</label>
                    <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Email</label>
                    <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>LinkedIn URL</label>
                    <input type="url" value={formData.linkedin || ''} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Photo (Will be automatically compressed)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {isEditing && !selectedFile && formData.image_url && (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Current image path: {formData.image_url}
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {uploading ? 'Saving...' : 'Save Director'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageDirectors
