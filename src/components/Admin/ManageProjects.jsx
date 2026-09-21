import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    category: '',
    description: '',
    status: 'Upcoming',
    impact: '',
    image_url: ''
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData(project)
      setIsEditing(true)
    } else {
      setFormData({
        id: null,
        title: '',
        category: '',
        description: '',
        status: 'Upcoming',
        impact: '',
        image_url: ''
      })
      setIsEditing(false)
    }
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, title: '', category: '', description: '', status: 'Upcoming', impact: '', image_url: '' })
    setSelectedFile(null)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const compressAndUploadImage = async (file) => {
    // 1. Compress the image (Crucial for Free Tier limits)
    const options = {
      maxSizeMB: 0.3, // Compress to ~300KB
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      
      // 2. Upload to Supabase Storage Bucket
      const fileExt = compressedFile.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, compressedFile, { upsert: true })

      if (error) throw error

      // 3. Return just the path/filename, NOT the full URL
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

      // If a new file was selected, compress and upload it first
      if (selectedFile) {
        const uploadedPath = await compressAndUploadImage(selectedFile)
        if (uploadedPath) {
          finalImagePath = uploadedPath
          
          // Optionally, if editing, we could delete the old image here from the bucket
        }
      }

      const projectData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        impact: formData.impact,
        image_url: finalImagePath
      }

      if (isEditing) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', formData.id)
        
        if (error) throw error
      } else {
        // Insert new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData])
          
        if (error) throw error
      }

      handleCloseModal()
      fetchProjects() // Refresh list
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      // 1. Delete the record from the database
      const { error: dbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // 2. Delete the associated image from the storage bucket to save space!
      // (Only try to delete if it looks like a bucket path, not a legacy JSON path like /Pic/...)
      if (imagePath && !imagePath.startsWith('/Pic/')) {
        await supabase.storage
          .from('project-images')
          .remove([imagePath])
      }

      fetchProjects() // Refresh list
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project.')
    }
  }

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Projects</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Project
        </button>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading projects...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      background: project.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                      color: project.status === 'Completed' ? '#4ade80' : '#fde047'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(project)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(project.id, project.image_url)}>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
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
                
                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Impact (e.g., "50+ students empowered")</label>
                  <input type="text" value={formData.impact} onChange={(e) => setFormData({...formData, impact: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
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
                  {uploading ? 'Saving & Compressing...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProjects
