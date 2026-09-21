import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { LogOut, FolderKanban, Image as ImageIcon } from 'lucide-react'
import ManageProjects from '../../components/Admin/ManageProjects'
import ManageGallery from '../../components/Admin/ManageGallery'
import './Admin.css'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin')
      } else {
        setSession(session)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) navigate('/admin')
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderKanban size={20} />
            Manage Projects
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={20} />
            Manage Gallery
          </button>
        </nav>

        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {activeTab === 'projects' && <ManageProjects />}
        {activeTab === 'gallery' && <ManageGallery />}
      </main>
    </div>
  )
}

export default AdminDashboard
