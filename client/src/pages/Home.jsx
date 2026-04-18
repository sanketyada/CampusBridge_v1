import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  BookOpen,
  MessageSquare,
  Database,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* HERO */}
      <section className="pt-32 pb-20">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-primary font-semibold mb-4">
              Career Ecosystem for Tier 2/3 Students
            </p>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Discover opportunities. <br />
              <span className="text-primary">Build real skills.</span>
            </h1>

            <p className="text-on-surface-variant text-lg max-w-lg mb-10">
              EventSphere bridges the awareness gap by combining event discovery,
              structured roadmaps, AI mentorship, and a smart resource system —
              all in one platform.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link to="/register" className="btn-primary">
                Get Started <ArrowRight size={18} className="ml-2" />
              </Link>

              <Link to="/events" className="btn-secondary">
                Explore Events
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block"
          >
            <div className="rounded-xl overflow-hidden shadow-ambient">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="students"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Most students miss opportunities
          </h2>
          <p className="text-on-surface-variant">
            Hackathons, internships, and learning paths exist — but they are scattered.
            EventSphere centralizes everything so you never miss out again.
          </p>
        </div>
      </section>

      {/* CORE MODULES */}
      <section className="section-spacing">
        <div className="container-custom">

          <div className="max-w-xl mb-16">
            <h2 className="text-3xl font-bold mb-4">
              A complete growth system
            </h2>
            <p className="text-on-surface-variant">
              Each module is designed to solve a real student problem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <Feature
              icon={<Calendar />}
              title="Event Hub"
              desc="Discover hackathons, webinars, and tech events in one place with direct registration and calendar sync."
              link="/events"
            />

            <Feature
              icon={<BookOpen />}
              title="Interactive Roadmaps"
              desc="Follow structured learning paths with dependency-based progression using visual maps."
              link="/roadmaps"
            />

            <Feature
              icon={<MessageSquare />}
              title="AI Mentorship"
              desc="Switch between beginner, advanced, and project modes for personalized technical guidance."
              link="/ai-bot"
            />

            <Feature
              icon={<Database />}
              title="Smart Resource Library"
              desc="Upload notes and query them using AI — like your own personal NotebookLM."
              link="/resources"
            />

            <Feature
              icon={<Users />}
              title="Community & Mentors"
              desc="Connect with peers, verified mentors, and alumni for guidance and discussions."
              link="/community"
            />

          </div>

        </div>
      </section>

      {/* TECH EDGE (VERY IMPORTANT DIFFERENTIATOR) */}
      <section className="section-spacing bg-surface-container-low">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Built with AI-first architecture
            </h2>

            <ul className="space-y-4 text-on-surface-variant">
              <li>• Multi-persona AI assistant (Beginner → Advanced)</li>
              <li>• RAG-based document querying system</li>
              <li>• Vector search for contextual answers</li>
              <li>• Real-time knowledge extraction from resources</li>
            </ul>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
            <p className="text-sm text-on-surface-variant mb-2">
              Example Query
            </p>
            <p className="font-medium">
              "Explain this PDF in simple terms"
            </p>

            <div className="mt-4 text-sm text-primary">
              → AI generates contextual answer using embeddings
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-custom text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start building your career today
          </h2>

          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            Join students who are actively learning, building, and growing with EventSphere.
          </p>

          <Link to="/register" className="btn-primary">
            Join EventSphere <ArrowRight size={18} className="ml-2" />
          </Link>

        </div>
      </section>

    </div>
  );
};

/* COMPONENT */
const Feature = ({ icon, title, desc, link }) => (
  <div className="card-premium">
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-on-surface-variant mb-6">{desc}</p>
    <Link to={link} className="text-sm font-semibold text-primary flex items-center gap-1">
      Learn more <ArrowRight size={16} />
    </Link>
  </div>
);

export default Home;
