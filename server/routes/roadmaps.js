const express = require('express');
const router = express.Router();

// Mock data for roadmaps since they are static for now
const roadmaps = [
  {
    _id: '1',
    title: 'Frontend Developer',
    description: 'Master HTML, CSS, JavaScript, React, and modern frontend tools.',
    category: 'Development',
    nodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    _id: '2',
    title: 'Backend Developer',
    description: 'Learn Node.js, Express, MongoDB, SQL, and system design.',
    category: 'Development',
    nodes: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    _id: '3',
    title: 'UI/UX Designer',
    description: 'From wireframing in Figma to building design systems.',
    category: 'Design',
    nodes: [1, 2, 3, 4, 5]
  }
];

router.get('/', (req, res) => {
  res.json(roadmaps);
});

module.exports = router;

