import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProject, getProjects } from '../api';
import ImageGallery from '../components/ImageGallery';
import Loading from '../components/Loading';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProject(id);
      setProject(data);
      
      // Load related projects
      const allProjects = await getProjects();
      const related = allProjects
        .filter(p => p.id !== parseInt(id))
        .slice(0, 3);
      setRelatedProjects(related);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Project not found'}</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-pink-500">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/projects" className="text-gray-500 hover:text-pink-500">Past Projects</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery 
              images={project.images || []} 
              mainImage={project.image_url}
              alt={project.title}
            />
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            {/* Badge */}
            <span className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Past Project
            </span>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {project.title}
            </h1>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Customer Feedback */}
            {project.customer_feedback && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-pink-300 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div>
                    <p className="text-gray-700 italic text-lg leading-relaxed mb-3">
                      "{project.customer_feedback}"
                    </p>
                    <p className="text-pink-600 font-medium">— Happy Customer</p>
                  </div>
                </div>
              </div>
            )}

            {/* Project Highlights */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Project Highlights</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom design tailored to client's vision
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium quality flowers and materials
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional setup and coordination
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-pink-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivered on time and on budget
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-4">
              <Link
                to="/contact"
                className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-4 px-8 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Your Project
              </Link>
              <p className="text-center text-gray-500 text-sm">
                Let us create something beautiful for your special occasion
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center text-gray-600 hover:text-pink-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">More Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  to={`/projects/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url || '/assets/images/img_1.svg'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/img_1.svg';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-pink-500 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
