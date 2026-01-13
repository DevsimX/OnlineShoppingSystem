export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>© {new Date().getFullYear()} Pop Local inspired demo.</span>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="hover:underline">Instagram</a>
            <a href="#" aria-label="Facebook" className="hover:underline">Facebook</a>
            <a href="#" aria-label="TikTok" className="hover:underline">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
