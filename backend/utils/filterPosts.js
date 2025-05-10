const isVulgar = (text, vulgarWords) => {
    const lowerText = text.toLowerCase();
    return vulgarWords.some(word => lowerText.includes(word));
  };
  
  const countWords = (text) => {
    const cleanText = text.replace(/<[^>]+>/g, ''); //Remove HTML
    const words = cleanText.match(/\b\w+\b/g) || []; //Matches words
    return words.length;
  };
  
  const filterBlogs = (posts, vulgarWords) => {
    return posts.filter(post => {
      const wordCount = countWords(post.content);
      return wordCount > 300 && !isVulgar(post.content, vulgarWords);
    });
  };
  
  module.exports = { filterBlogs };