import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0c0f] py-10 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <img src="/logo.png" alt="Express InMusic" className="h-12 object-contain" />
          <p className="text-sm">Turn stories into studio-grade songs with a blend of AI + artists.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          <Link to="/copyright-policy" className="hover:text-white transition-colors">Copyright Policy</Link>
          <Link to="/content-usage-policy" className="hover:text-white transition-colors">Content Usage Policy</Link>
          <span>Support</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
}
