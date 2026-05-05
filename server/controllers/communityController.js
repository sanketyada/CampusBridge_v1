const User = require('../models/User');
const Post = require('../models/Post');

exports.getCommunityData = async (req, res) => {
  try {
    // Get total user count
    const userCount = await User.countDocuments();

    // Get active mentors (first 5 for now)
    const mentors = await User.find({ role: 'mentor' })
      .select('name role avatar')
      .limit(5);

    // Get trending tags from last 100 posts
    const recentPosts = await Post.find().limit(100).select('content');
    const tagsMap = {};
    
    // Simple regex to find hashtags
    recentPosts.forEach(post => {
      const hashtags = post.content.match(/#\w+/g);
      if (hashtags) {
        hashtags.forEach(tag => {
          tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        });
      }
    });

    const trendingTags = Object.entries(tagsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // Fallback tags if none found
    const finalTags = trendingTags.length > 0 ? trendingTags : ['#campus', '#opportunity', '#learning', '#bridge', '#student'];

    res.status(200).json({
      status: 'success',
      data: {
        userCount,
        mentors,
        trendingTags: finalTags
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name role avatar bio college skills');
    res.status(200).json({ status: 'success', data: mentors });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
