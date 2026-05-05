import React, { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink, Sparkles, ArrowRight, Loader2, Target, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as joint from '@joint/core';
import api from '../../services/api';

const roadmapData = {
  roles: [
    "Frontend", "Backend", "Full Stack", "DevOps", "DevSecOps", "Data Analyst",
    "AI Engineer", "AI and Data Scientist", "Data Engineer", "Android",
    "Machine Learning", "PostgreSQL", "iOS", "Blockchain", "QA", "Software Architect",
    "Cyber Security", "UX Design", "Technical Writer", "Game Developer",
    "Server Side Game Developer", "MLOps", "Product Manager", "Engineering Manager",
    "Developer Relations", "BI Analyst"
  ]
};

const RoadmapViewer = () => {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [search, setSearch] = useState('');
  
  // Planner State
  const [task, setTask] = useState('');
  const [days, setDays] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [error, setError] = useState('');
  
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const paperRef = useRef(null);

  const filteredRoles = roadmapData.roles.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  // Initialize and Render JointJS
  useEffect(() => {
    if (activeTab === 'planner' && roadmapSteps.length > 0 && canvasRef.current) {
      // Clear previous
      canvasRef.current.innerHTML = '';
      
      const graph = new joint.dia.Graph();
      graphRef.current = graph;

      // Calculate dynamic height based on steps
      const verticalGap = 160;
      const paperHeight = Math.max(800, roadmapSteps.length * verticalGap + 200);

      const paper = new joint.dia.Paper({
        el: canvasRef.current,
        model: graph,
        width: 800,
        height: paperHeight,
        gridSize: 10,
        drawGrid: false,
        background: { color: '#FFFFFF' },
        interactive: false
      });
      paperRef.current = paper;

      renderRoadmap(graph, roadmapSteps, verticalGap);
    }
  }, [activeTab, roadmapSteps]);

  const renderRoadmap = (graph, steps, verticalGap) => {
    // Define a custom shape with two separate text labels
    const RoadmapNode = joint.dia.Element.define('custom.RoadmapNode', {
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          rx: 20,
          ry: 20,
          strokeWidth: 2
        },
        dayLabel: {
          refX: '50%',
          refY: '30%',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '900',
          fontSize: 11,
          letterSpacing: '0.1em'
        },
        titleLabel: {
          refX: '50%',
          refY: '65%',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '700',
          fontSize: 13
        }
      }
    }, {
      markup: [{
        tagName: 'rect',
        selector: 'body'
      }, {
        tagName: 'text',
        selector: 'dayLabel'
      }, {
        tagName: 'text',
        selector: 'titleLabel'
      }]
    });

    const nodes = [];
    const canvasWidth = 800;
    const nodeWidth = 280;
    const nodeHeight = 90;
    
    steps.forEach((step, index) => {
      // Zig-zag layout
      const xOffset = (index % 2 === 0 ? -50 : 50);
      const x = (canvasWidth / 2) - (nodeWidth / 2) + xOffset;
      const y = 100 + (index * verticalGap);

      const isFirst = index === 0;
      const isLast = index === steps.length - 1;
      const isHighlight = isFirst || isLast;

      const textColor = isHighlight ? '#FFFFFF' : '#191C1D';
      const dayColor = isHighlight ? 'rgba(255,255,255,0.8)' : '#0052CC';

      const node = new RoadmapNode();
      node.position(x, y);
      node.resize(nodeWidth, nodeHeight);
      node.attr({
        body: {
          fill: isFirst ? '#0052CC' : (isLast ? '#10B981' : '#FFFFFF'),
          stroke: isFirst ? '#003D9B' : (isLast ? '#059669' : '#EDEEEF'),
          filter: {
            name: 'dropShadow',
            args: { dx: 0, dy: 2, blur: 8, color: '#00000012' }
          }
        },
        dayLabel: {
          text: `DAY ${step.day}`,
          fill: dayColor
        },
        titleLabel: {
          text: step.title.length > 28 ? step.title.substring(0, 28) + '…' : step.title,
          fill: textColor
        }
      });
      node.addTo(graph);
      nodes.push(node);

      if (index > 0) {
        const link = new joint.shapes.standard.Link();
        link.source(nodes[index - 1]);
        link.target(nodes[index]);
        link.router('manhattan', {
          padding: 20,
          startDirections: ['bottom'],
          endDirections: ['top']
        });
        link.connector('rounded', { radius: 10 });
        link.attr({
          line: {
            stroke: '#C3C6D6',
            strokeWidth: 2,
            targetMarker: {
              'type': 'path',
              'd': 'M 10 -5 0 0 10 5 Z',
              'stroke': '#C3C6D6',
              'fill': '#C3C6D6'
            }
          }
        });
        link.addTo(graph);
      }
    });
  };

  const wrapText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if ((currentLine + ' ' + words[i]).length <= maxLength) {
        currentLine += ' ' + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines.join('\n');
  };

  const handleGenerate = async () => {
    if (!task) return;
    setIsGenerating(true);
    setError('');
    setRoadmapSteps([]);
    
    try {
      const response = await api.post('/roadmaps/generate', { task, days });
      setRoadmapSteps(response.data.data);
    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.response?.data?.message || 'The AI mentor is currently busy. Please try again in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Section */}
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4"
            >
              Educational Architecture
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Navigate your <span className="text-primary">career path.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-on-surface-variant text-xl leading-relaxed max-w-2xl"
            >
              Explore industry-vetted roadmaps or leverage our AI engine to architect 
              a personalized study plan tailored to your timeline.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-32">
        <div className="container-custom">
          
          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-12 bg-surface-container-low p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'roadmap' 
                  ? 'bg-white text-primary shadow-ambient' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Target size={18} /> Career Roles
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'planner' 
                  ? 'bg-white text-primary shadow-ambient' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Sparkles size={18} /> AI Architect
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'roadmap' ? (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Search Bar */}
                <div className="relative max-w-2xl group">
                  <div className="relative flex items-center bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-card focus-within:shadow-ambient focus-within:border-primary/30 transition-all">
                    <Search className="ml-6 text-on-surface-variant" size={20} />
                    <input
                      type="text"
                      placeholder="Search roles (e.g. Frontend Developer)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-4 pr-10 py-5 outline-none text-lg font-medium text-on-surface"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRoles.map((item, idx) => (
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      key={item}
                      href={`https://roadmap.sh/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="card-premium group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
                        {item[0]}
                      </div>
                      <h3 className="text-lg font-bold text-on-surface mb-2">{item}</h3>
                      <div className="flex items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                        Explore <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="planner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl"
              >
                <div className="card-premium p-10 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <Target size={14} className="text-primary" /> Learning Goal
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Mastering Backend Architecture"
                        className="w-full px-6 py-4 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none font-bold text-on-surface transition-all"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <Clock size={14} className="text-primary" /> Study Duration (Days)
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="30"
                        className="w-full px-6 py-4 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none font-bold text-on-surface transition-all"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 font-bold text-sm">
                      <AlertCircle size={20} />
                      {error}
                    </div>
                  )}

                  <button 
                    onClick={handleGenerate}
                    disabled={!task || isGenerating}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin mr-3" size={20} />
                        Architecting Plan...
                      </>
                    ) : (
                      <>
                        Generate Architectural Roadmap <Sparkles className="ml-3" size={20} />
                      </>
                    )}
                  </button>
                </div>

                {roadmapSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium p-0 overflow-hidden"
                  >
                    <div className="p-8 border-b border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/50">
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-3">
                          <Target className="text-primary" size={24} /> {task} Roadmap
                        </h3>
                        <p className="text-on-surface-variant text-sm font-medium mt-1">Generated specifically for your {days}-day timeline.</p>
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="btn-secondary py-2.5 px-6 text-sm"
                      >
                        Export Strategy
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto p-12 flex justify-center bg-white">
                      <div ref={canvasRef} className="border border-outline-variant rounded-2xl shadow-card"></div>
                    </div>
                    
                    <div className="p-4 bg-primary text-white flex items-center justify-center gap-3">
                      <Sparkles size={14} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Architected by Groq AI × Rendered via JointJS
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default RoadmapViewer;
