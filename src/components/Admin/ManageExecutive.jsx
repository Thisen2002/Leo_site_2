import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

function ManageExecutive() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    position: '',
    bio: '',
    email: '',
    linkedin: '',
    image_url: '',
    term: '26/27'
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  const [filterTerm, setFilterTerm] = useState('All')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('executive_board')
      .select('*')
      .order('id', { ascending: true }) 
    
    if (error) {
      console.error('Error fetching executive board:', error)
    } else {
      setMembers(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (member = null) => {
    if (member) {
      setFormData({
        ...member,
        term: member.term || '25/26'
      })
      setIsEditing(true)
    } else {
      setFormData({
        id: null,
        name: '',
        position: '',
        bio: '',
        email: '',
        linkedin: '',
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
    setFormData({ id: null, name: '', position: '', bio: '', email: '', linkedin: '', image_url: '', term: '26/27' })
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
        .from('exco-images')
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
        name: formData.name,
        position: formData.position,
        bio: formData.bio,
        email: formData.email,
        linkedin: formData.linkedin,
        image_url: finalImagePath,
        term: formData.term
      }

      if (isEditing) {
        const { error } = await supabase
          .from('executive_board')
          .update(dbData)
          .eq('id', formData.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('executive_board')
          .insert([dbData])
        if (error) throw error
      }

      handleCloseModal()
      fetchMembers()
    } catch (error) {
      console.error('Error saving member:', error)
      alert('Failed to save member.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return

    try {
      const { error: dbError } = await supabase
        .from('executive_board')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (imagePath && !imagePath.startsWith('/Pic/')) {
        await supabase.storage
          .from('exco-images')
          .remove([imagePath])
      }

      fetchMembers()
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Failed to delete member.')
    }
  }

  const filteredMembers = filterTerm === 'All'
    ? members
    : members.filter(m => m.term === filterTerm)

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Executive Board</h2>
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
            Add Member
          </button>
        </div>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading members...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Term</th>
                <th>Position</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                        background: 'rgba(255,255,255,0.1)'
                      }}>
                        {member.image_url ? (
                          <img 
                            src={member.image_url.startsWith('/Pic/') ? member.image_url : supabase.storage.from('exco-images').getPublicUrl(member.image_url).data.publicUrl} 
                            alt={member.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40/1e3c72/ffffff?text=' + member.name.charAt(0) }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {member.name}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{member.term || '25/26'}</span>
                  </td>
                  <td>{member.position}</td>
                  <td>{member.email || '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(member)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(member.id, member.image_url)}>
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
              <h3>{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 2 }}>
                    <label>Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Leastic Term</label>
                    <select value={formData.term} onChange={(e) => setFormData({...formData, term: e.target.value})} required>
                      <option value="26/27">26/27</option>
                      <option value="25/26">25/26</option>
                      <option value="24/25">24/25</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>LinkedIn URL</label>
                    <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
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
                  {uploading ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageExecutive
