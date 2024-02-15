import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <main id="content" className="bg-gradient-to-b from-violet-500 to-violet-700 flex items-center justify-center h-screen">
      <div className="grid place-items-center">
        <h1 className="text-white">A better way of keeping track of your notes</h1>
        <p className="text-white mb-4">Try our early beta and never lose track of your notes again!</p>
        <p id="cta">
          <Link to="/notes" className="text-white bg-transparent border border-white rounded px-4 py-2 hover:bg-white hover:text-violet-500 mt-4">
            Try Now!
          </Link>
        </p>
      </div>
    </main>
  );
}
