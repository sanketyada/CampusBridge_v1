const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.generateRoadmap = async (req, res) => {
  try {
    const { task, days } = req.body;

    if (!task || !days) {
      return res.status(400).json({ message: 'Task and days are required' });
    }

    const prompt = `Generate a highly structured roadmap for a student to learn "${task}" in exactly ${days} days. 
    Focus on key milestones and actionable steps.
    
    Return ONLY a JSON array of objects. Do not include any other text, markdown formatting, or explanations.
    Each object MUST have the following structure:
    {
      "day": number,
      "title": "string (short, max 50 chars)"
    }
    
    Ensure you provide exactly one object per day from day 1 to day ${days}.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Low temperature for consistent JSON output
    });

    let roadmapData;
    try {
      const content = chatCompletion.choices[0].message.content;
      // Extract JSON if there's any surrounding text (though we asked for none)
      const jsonMatch = content.match(/\[.*\]/s);
      roadmapData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      console.error('Groq Response Parse Error:', parseError);
      console.log('Raw content:', chatCompletion.choices[0].message.content);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    res.status(200).json({
      status: 'success',
      data: roadmapData
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};
