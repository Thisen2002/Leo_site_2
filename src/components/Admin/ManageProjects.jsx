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
    image_url: '',
    term: '26/27'
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  // Filter state for Admin View
  const [filterTerm, setFilterTerm] = useState('All')

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
      // Auto-fix legacy statuses for the admin (since they have auth privileges)
      const invalidProjects = data.filter(p => p.status === '26/27 Term')
      if (invalidProjects.length > 0) {
        console.log(`Auto-fixing ${invalidProjects.length} legacy project statuses...`)
        for (const p of invalidProjects) {
          await supabase.from('projects').update({ status: 'Ongoing' }).eq('id', p.id)
          p.status = 'Ongoing' // update local state
        }
      }
      setProjects(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (project = null) => {
    if (project) {
      // Fix legacy status
      let sanitizedStatus = project.status;
      if (!['Upcoming', 'Completed', 'Ongoing'].includes(sanitizedStatus)) {
        sanitizedStatus = 'Ongoing';
      }

      setFormData({
        ...project,
        status: sanitizedStatus,
        term: project.term || '25/26'
      })
      setIsEditing(true)
    } else {
      setFormData({
        id: null,
        title: '',
        category: '',
        description: '',
        status: 'Upcoming',
        impact: '',
        image_url: '',
        term: '26/27'
      })
      setIsEditing(false)
    }
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ id: null, title: '', category: '', description: '', status: 'Upcoming', impact: '', image_url: '', term: '26/27' })
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
        .from('project-images')
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

      const projectData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        impact: formData.impact,
        image_url: finalImagePath,
        term: formData.term
      }

      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', formData.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData])
          
        if (error) throw error
      }

      handleCloseModal()
      fetchProjects() 
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
      const { error: dbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (imagePath && !imagePath.startsWith('/Pic/')) {
        await supabase.storage
          .from('project-images')
          .remove([imagePath])
      }

      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project.')
    }
  }

  const filteredProjects = filterTerm === 'All' 
    ? projects 
    : projects.filter(p => p.term === filterTerm)

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Projects</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterTerm} 
            onChange={(e) => setFilterTerm(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="All">All Terms</option>
            <option value="26/27">26/27</option>
            <option value="25/26">25/26</option>
          </select>
          <button className="add-btn" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add New Project
          </button>
        </div>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading projects...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Term</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{project.term || '25/26'}</span>
                  </td>
                  <td>{project.category}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      background: project.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' : (project.status === 'Ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(234, 179, 8, 0.2)'),
                      color: project.status === 'Completed' ? '#4ade80' : (project.status === 'Ongoing' ? '#60a5fa' : '#fde047')
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
                    <label>Leastic Term</label>
                    <select value={formData.term} onChange={(e) => setFormData({...formData, term: e.target.value})} required>
                      <option value="26/27">26/27</option>
                      <option value="25/26">25/26</option>
                      <option value="24/25">24/25</option>
                    </select>
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
                  <label>Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
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
                  {uploading ? 'Saving...' : 'Save Project'}
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
