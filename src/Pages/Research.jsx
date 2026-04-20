import './Research.css'
import '../utils/scrollAnimations.css'
import {
    useScrollAnimation,
    useStaggerAnimation,
    getAnimationClass,
    ANIMATION_CONFIGS
} from '../utils/scrollAnimations'

const researchPdfs = [
    {
        fileName: 'Factors Contributing to Emergency Care among Cardiac Patients and Strategies for Improving Rapid Response in the Kandy District.pdf'
    }
]

const getFileUrl = (fileName) => `/Research/${encodeURIComponent(fileName)}`

const formatTitle = (fileName) => fileName.replace(/\.pdf$/i, '')

function Research() {
    const [heroRef, heroVisible] = useScrollAnimation(ANIMATION_CONFIGS.hero)
    const [libraryRef, libraryVisible] = useStaggerAnimation(researchPdfs.length || 1, 120)

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
                        <h2 className={getAnimationClass('slideInUp', researchPdfs.length > 0)}>
                            Available PDFs
                        </h2>

                        {researchPdfs.length === 0 ? (
                            <div className="empty-state">
                                <p>No research PDFs available right now.</p>
                            </div>
                        ) : (
                            <div className="pdf-grid">
                                {researchPdfs.map((paper, index) => (
                                    <article
                                        key={paper.fileName}
                                        className={`pdf-card card-animation ${libraryVisible.has(index) ? 'animate-visible' : 'animate-hidden'}`}
                                    >
                                        <div className="pdf-meta">PDF Document</div>
                                        <h3>{formatTitle(paper.fileName)}</h3>
                                        <p className="file-name">{paper.fileName}</p>

                                        <div className="pdf-actions">
                                            <a
                                                className="secondary-btn"
                                                href={getFileUrl(paper.fileName)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open
                                            </a>
                                            <a
                                                className="primary-btn"
                                                href={getFileUrl(paper.fileName)}
                                                download={paper.fileName}
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