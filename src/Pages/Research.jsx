import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import './Research.css'
import '../utils/scrollAnimations.css'
import {
    useScrollAnimation,
    useStaggerAnimation,
    getAnimationClass,
    ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

function Research() {
    const [researchPdfs, setResearchPdfs] = useState([])
    const [loading, setLoading] = useState(true)
    const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero)
    
    // We use a safe length or default to 1 for the stagger animation hook
    const [libraryRef, libraryVisible] = useStaggerAnimation(Math.max(researchPdfs.length, 1), 120)

    useEffect(() => {
        const fetchResearch = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('research_papers')
                .select('*')
                .order('created_at', { ascending: false })
                
            if (error) {
                console.error('Error fetching research papers:', error)
            } else {
                setResearchPdfs(data || [])
            }
            setLoading(false)
        }

        fetchResearch()
    }, [])

    const getFileUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('/Research/')) return path;
        return supabase.storage.from('research-files').getPublicUrl(path).data.publicUrl;
    }

    return (
        <div className="research-page">
            <header className="research-hero" ref={heroRef}>
                <div className="container">
                    <p className={`eyebrow ${getAnimationClass('fadeInUp', heroVisible)}`}>
                        Research Library
                    </p>
                    <h1 className={`${getAnimationClass('slideInUp', heroVisible)} animate-delay-200`}>
                        Download Our Research Papers
                    </h1>
                    <p className={`subtitle ${getAnimationClass('fadeInUp', heroVisible)} animate-delay-400`}>
                        Access our published research documents directly from this page.
                    </p>
                </div>
            </header>

            <main>
                <section className="research-library-section" ref={libraryRef}>
                    <div className="container">
                        <h2 className={getAnimationClass('slideInUp', !loading && researchPdfs.length > 0)}>
                            Available PDFs
                        </h2>

                        {loading ? (
                            <div className="empty-state">
                                <p>Loading research papers...</p>
                            </div>
                        ) : researchPdfs.length === 0 ? (
                            <div className="empty-state">
                                <p>No research PDFs available right now.</p>
                            </div>
                        ) : (
                            <div className="pdf-grid">
                                {researchPdfs.map((paper, index) => (
                                    <article
                                        key={paper.id}
                                        className={`pdf-card card-animation ${libraryVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}
                                    >
                                        <div className="pdf-meta">PDF Document</div>
                                        <h3>{paper.title}</h3>
                                        <p className="file-name">{paper.file_name}</p>

                                        <div className="pdf-actions">
                                            <a
                                                className="secondary-btn"
                                                href={getFileUrl(paper.file_url)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open
                                            </a>
                                            <a
                                                className="primary-btn"
                                                href={getFileUrl(paper.file_url)}
                                                download={paper.file_name}
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Research