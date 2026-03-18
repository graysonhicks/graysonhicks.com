export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyber-cyan/10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display text-sm tracking-[0.2em] neon-text mb-4">
              CONTACT
            </h3>
            <div className="space-y-2 font-body text-sm">
              <p>
                <a href="mailto:graysonhicks@gmail.com" className="text-gray-400 hover:text-cyber-cyan">
                  graysonhicks@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:8039171953" className="text-gray-400 hover:text-cyber-cyan">
                  (803) 917-1953
                </a>
              </p>
            </div>
          </div>
          <div className="md:text-right">
            <h3 className="font-display text-sm tracking-[0.2em] neon-text-magenta mb-4">
              LINKS
            </h3>
            <div className="space-y-2 font-body text-sm">
              <p>
                <a
                  href="https://github.com/graysonhicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-magenta"
                >
                  github
                </a>
              </p>
              <p>
                <a
                  href="https://twitter.com/graysonhicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-magenta"
                >
                  twitter
                </a>
              </p>
              <p>
                <a
                  href="https://instagram.com/jgraysonhicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-magenta"
                >
                  instagram
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-cyber-cyan/10 text-center">
          <p className="text-xs font-mono text-gray-600 tracking-widest">
            &copy; {new Date().getFullYear()} // GRAYSON HICKS // ALL SYSTEMS OPERATIONAL
          </p>
        </div>
      </div>
    </footer>
  )
}
