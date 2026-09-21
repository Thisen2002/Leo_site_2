import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Plus, Trash2, FileText, X } from 'lucide-react'

function ManageResearch() {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    title: ''
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching research papers:', error)
    } else {
      setPapers(data)
    }
    setLoading(false)
  }

  const handleOpenModal = () => {
    setFormData({ title: '' })
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ title: '' })
    setSelectedFile(null)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      // Auto-fill title from filename if not set
      if (!formData.title) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        setFormData(prev => ({ ...prev, title: nameWithoutExt }))
      }
    }
  }

  const uploadPdf = async (file) => {
    try {
      const fileExt = file.name.split('.').pop() || 'pdf'
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
      const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-') || 'file'
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('research-files')
        .upload(fileName, file, { 
            upsert: true,
            contentType: 'application/pdf'
        })

      if (error) throw error
      return data.path
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Failed to upload PDF. Please try again.')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
        alert("Please select a PDF file to upload.")
        return
    }

    setUploading(true)

    try {
      const uploadedPath = await uploadPdf(selectedFile)
      
      if (!uploadedPath) {
          setUploading(false)
          return
      }

      const dbData = {
        title: formData.title,
        file_name: selectedFile.name,
        file_url: uploadedPath
      }

      const { error } = await supabase
        .from('research_papers')
        .insert([dbData])
        
      if (error) throw error

      handleCloseModal()
      fetchPapers()
    } catch (error) {
      console.error('Error saving research paper:', error)
      alert('Failed to save research paper.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm('Are you sure you want to delete this research paper?')) return

    try {
      const { error: dbError } = await supabase
        .from('research_papers')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      if (fileUrl && !fileUrl.startsWith('/Research/')) {
        await supabase.storage
          .from('research-files')
          .remove([fileUrl])
      }

      fetchPapers()
    } catch (error) {
      console.error('Error deleting research paper:', error)
      alert('Failed to delete research paper.')
    }
  }

  return (
    <div className="manage-projects">
      <div className="manager-header">
        <h2>Manage Research Papers</h2>
        <button className="add-btn" onClick={handleOpenModal}>
          <Plus size={18} />
          Add Paper
        </button>
      </div>

      <div className="projects-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading research papers...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paper</th>
                <th>File Name</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', 
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#60a5fa'
                      }}>
                        <FileText size={20} />
                      </div>
                      <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paper.title}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{paper.file_name}</span>
                  </td>
                  <td>{new Date(paper.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn delete-btn" onClick={() => handleDelete(paper.id, paper.file_url)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {papers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No research papers found. Add one to get started.
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
              <h3>Add New Research Paper</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Title (Display Name)</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    required 
                    placeholder="e.g. Analysis of Emergency Care"
                  />
                </div>

                <div className="form-group">
                  <label>PDF File</label>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    required
                  />
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Only PDF files are supported.
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageResearch
