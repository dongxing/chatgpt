import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';
import { getProjects } from '../api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Our Work"
        subtitle="Browse through our portfolio of beautiful floral projects"
        buttonText="View Projects"
        buttonLink="#projects"
        backgroundImage="/assets/images/bg_1.jpg"
        centered={true}
      />

      {/* Projects Grid */}
      <section id="projects" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="Past Projects" />

          {loading ? (
            <Loading text="Loading projects..." />
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No projects to display yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-pink-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-pink-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-pink-100">Weddings</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-pink-100">Corporate Events</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-pink-100">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're planning a wedding, corporate event, or just want to brighten someone's day, 
            we'd love to help bring your floral vision to life.
          </p>
          <a
            href="/contact"
            className="inline-block bg-pink-500 text-white font-medium px-8 py-4 rounded hover:bg-pink-600 transition-colors duration-300"
          >
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  );
}

export default Projects;
