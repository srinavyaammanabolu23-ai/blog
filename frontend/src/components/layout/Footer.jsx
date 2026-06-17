export default function Footer() {
  return (
    <footer className="mt-20 py-12 px-6 border-t-[3px] border-black bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-black text-white font-display font-bold text-lg">B</div>
          <span className="font-display font-bold text-xl uppercase tracking-tighter text-black">BlogFlow</span>
        </div>
        <div className="flex items-center gap-8 font-mono-bold text-xs">
          <a href="#" className="hover:bg-[var(--accent-1)] px-2 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000] transition-all">Vision</a>
          <a href="#" className="hover:bg-[var(--accent-2)] hover:text-white px-2 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000] transition-all">Manifesto</a>
          <a href="#" className="hover:bg-[var(--accent-3)] px-2 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000] transition-all">Contact</a>
        </div>
        <p className="text-xs font-mono font-bold uppercase">
          © {new Date().getFullYear()} BLOGFLOW. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
