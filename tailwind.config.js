// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // `darkMode: 'class'` එක මෙහි එකතු කරන්න
  darkMode: 'class', // මෙය Tailwind CSS හි Dark Mode ක්‍රියාත්මක කිරීමට අත්‍යවශ්‍යයි
  
  content: [
    // ඔබගේ React components වලට අදාළ paths මෙහි අඩංගු විය යුතුය
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // ඔබ index.html ගොනුවේ class එක වෙනස් කරන්නේ නම් මෙයද අවශ්‍ය විය හැක
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};