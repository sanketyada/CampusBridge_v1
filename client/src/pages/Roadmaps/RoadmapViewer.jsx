import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

const roadmapData = {
  roles: [
    "Frontend","Backend","Full Stack","DevOps","DevSecOps","Data Analyst",
    "AI Engineer","AI and Data Scientist","Data Engineer","Android",
    "Machine Learning","PostgreSQL","iOS","Blockchain","QA","Software Architect",
    "Cyber Security","UX Design","Technical Writer","Game Developer",
    "Server Side Game Developer","MLOps","Product Manager","Engineering Manager",
    "Developer Relations","BI Analyst"
  ],

  skills: [
    "SQL","Computer Science","React","Vue","Angular","JavaScript","TypeScript",
    "Node.js","Python","System Design","Java","ASP.NET Core","API Design",
    "Spring Boot","Flutter","C++","Rust","Go","GraphQL","React Native",
    "Design System","Prompt Engineering","MongoDB","Linux","Kubernetes",
    "Docker","AWS","Terraform","Data Structures & Algorithms","Redis",
    "Git and GitHub","PHP","Cloudflare","AI Red Teaming","AI Agents",
    "Next.js","Code Review","Kotlin","HTML","CSS","Swift","Shell",
    "Laravel","Elasticsearch","WordPress","Django","Ruby","Ruby on Rails",
    "Scala"
  ],

  projects: [
    "Frontend","Backend","DevOps","Best Practices","AWS",
    "API Security","Backend Performance","Frontend Performance","Code Review"
  ]
};

const RoadmapExplorer = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [search, setSearch] = useState('');

  const currentList = roadmapData[activeTab];

  const filteredList = currentList.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-10 shadow-xl">

      {/* 🔥 Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {['roles','skills','projects'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition 
              ${activeTab === tab 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative max-w-xl mx-auto mb-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition"></div>

        <div className="relative flex items-center">
          <Search className="absolute left-5 text-gray-400 group-focus-within:text-primary" size={20} />

          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-10 py-4 border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-lg font-medium"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 🧩 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <a
              key={item}
              href={`https://roadmap.sh/${item.toLowerCase().replace(/\s+/g, '-')}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-6 border rounded-2xl hover:shadow-lg hover:border-primary transition"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 font-bold text-primary">
                {item[0]}
              </div>

              <span className="font-semibold text-center text-sm">{item}</span>
              <ExternalLink size={14} className="mt-2 text-gray-400" />
            </a>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-semibold">
            No results found 🚫
          </p>
        )}
      </div>

    </div>
  );
};

export default RoadmapExplorer;
