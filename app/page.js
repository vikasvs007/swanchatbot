import dynamic from 'next/dynamic'

const Chatbot = dynamic(() => import('../components/Chatbot'), { ssr: false })
const SwanSorterLogo = dynamic(() => import('../components/SwanSorterLogo'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="bg-card neon-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SwanSorterLogo size={36} className="text-primary neon-glow" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              SwanSorter
            </h1>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24 cyber-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 neon-glow">Swan Sorter</h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
              Advanced data sorting solutions with futuristic AI technology
            </p>
          </div>
        </div>
      </section>

      <Chatbot />
    </main>
  )
} 