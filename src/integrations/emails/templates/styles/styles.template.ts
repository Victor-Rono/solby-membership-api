/* eslint-disable prettier/prettier */
export function getTemplateStyles() {
    return `
    <style>
      /* Define root variables for custom colors */
      :root {
        --primary: #613506;
        --secondary: #41672d;
        --accent: #077091;
        --highlight: #e8c78a;
        --success: #0b930b;
        --danger: #ff0000;
        --info: #2f4fd0;
        --warning: #eab305;
        --font-sans: 'Helvetica Neue', Arial, sans-serif;
        --font-serif: 'Georgia', serif;
        --font-mono: 'Courier New', monospace;
      }

      div {
        font-family: var(--font-sans);
      }
  
      /* Background colors */
      .bg-primary { background-color: var(--primary); }
      .bg-secondary { background-color: var(--secondary); }
      .bg-accent { background-color: var(--accent); }
      .bg-highlight { background-color: var(--highlight); }
      .bg-success { background-color: var(--success); }
      .bg-danger { background-color: var(--danger); }
      .bg-info { background-color: var(--info); }
      .bg-warning { background-color: var(--warning); }
  
      /* Text colors */
      .text-primary { color: var(--primary); }
      .text-secondary { color: var(--secondary); }
      .text-accent { color: var(--accent); }
      .text-highlight { color: var(--highlight); }
      .text-success { color: var(--success); }
      .text-danger { color: var(--danger); }
      .text-info { color: var(--info); }
      .text-warning { color: var(--warning); }
  
      /* Font families */
      .font-sans { font-family: var(--font-sans); }
      .font-serif { font-family: var(--font-serif); }
      .font-mono { font-family: var(--font-mono); }
  
      /* Text sizes */
      .text-xs { font-size: 0.75rem; }  /* Tailwind's text-xs */
      .text-sm { font-size: 0.875rem; }  /* Tailwind's text-sm */
      .text-base { font-size: 1rem; }  /* Tailwind's text-base */
      .text-lg { font-size: 1.125rem; }  /* Tailwind's text-lg */
      .text-xl { font-size: 1.25rem; }  /* Tailwind's text-xl */
      .text-2xl { font-size: 1.5rem; }  /* Tailwind's text-2xl */
      .text-3xl { font-size: 1.875rem; }  /* Tailwind's text-3xl */
      .text-4xl { font-size: 2.25rem; }  /* Tailwind's text-4xl */
      .text-5xl { font-size: 3rem; }  /* Tailwind's text-5xl */
      .text-6xl { font-size: 3.75rem; }  /* Tailwind's text-6xl */
  
      /* Border colors */
      .border-primary { border-color: var(--primary); }
      .border-secondary { border-color: var(--secondary); }
      .border-accent { border-color: var(--accent); }
      .border-highlight { border-color: var(--highlight); }
      .border-success { border-color: var(--success); }
      .border-danger { border-color: var(--danger); }
      .border-info { border-color: var(--info); }
      .border-warning { border-color: var(--warning); }
  
      /* Hover states */
      .hover\:bg-primary:hover { background-color: var(--primary); }
      .hover\:bg-secondary:hover { background-color: var(--secondary); }
      .hover\:bg-accent:hover { background-color: var(--accent); }
      .hover\:bg-highlight:hover { background-color: var(--highlight); }
      .hover\:bg-success:hover { background-color: var(--success); }
      .hover\:bg-danger:hover { background-color: var(--danger); }
      .hover\:bg-info:hover { background-color: var(--info); }
      .hover\:bg-warning:hover { background-color: var(--warning); }
  
      .hover\:text-primary:hover { color: var(--primary); }
      .hover\:text-secondary:hover { color: var(--secondary); }
      .hover\:text-accent:hover { color: var(--accent); }
      .hover\:text-highlight:hover { color: var(--highlight); }
      .hover\:text-success:hover { color: var(--success); }
      .hover\:text-danger:hover { color: var(--danger); }
      .hover\:text-info:hover { color: var(--info); }
      .hover\:text-warning:hover { color: var(--warning); }
  
      /* Other Utility classes */
      .flex { display: flex; }
      .flex-row { flex-direction: row; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .m-4 { margin: 1rem; }
      .m-6 { margin: 1.5rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .text-center { text-align: center; }
      .bg-white { background-color: white; }
      .text-black { color: black; }
      .text-white { color: white; }
      .cursor-pointer { cursor: pointer; }
    </style>
    `;
}
