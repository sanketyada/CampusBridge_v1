const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', 'uploads', 'scratch', '.gemini'];
const IGNORED_FILES = ['package-lock.json', '.env', '.gitignore'];
const RELEVANT_EXTENSIONS = ['.js', '.jsx', '.json', '.md'];

/**
 * Recursively scans a directory and returns a structured object of files and their content (limited)
 */
const scanDirectory = (dir, root, depth = 0) => {
  if (depth > 10) return []; // Allow more depth

  let results = [];
  try {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!IGNORED_DIRS.includes(file)) {
          results = results.concat(scanDirectory(filePath, root, depth + 1));
        }
      } else {
        const ext = path.extname(file);
        const relativePath = path.relative(root, filePath);
        
        if (RELEVANT_EXTENSIONS.includes(ext) && !IGNORED_FILES.includes(file)) {
          // Skip non-implementation files if needed, but let's be broader for now
          let content = fs.readFileSync(filePath, 'utf8');
          if (content.length > 1000) {
            content = content.substring(0, 1000) + '\n... [Content Truncated]';
          }
          results.push({
            path: relativePath,
            content: content
          });
        }
      }
    }
  } catch (err) {
    // Ignore access errors etc
  }

  return results;
};

/**
 * Gets a summarized context of the codebase
 */
const getCodebaseContext = () => {
  try {
    // Try to find the root by looking for package.json or moving up from __dirname
    const rootPath = path.resolve(__dirname, '../../');
    const files = scanDirectory(rootPath, rootPath);
    
    let context = "Codebase Structure and Implementation Reference:\n\n";
    files.forEach(f => {
      context += `--- File: ${f.path} ---\n${f.content}\n\n`;
    });
    
    return context;
  } catch (err) {
    console.error("Code Analysis Error:", err);
    return "Error analyzing codebase.";
  }
};

module.exports = { getCodebaseContext };
