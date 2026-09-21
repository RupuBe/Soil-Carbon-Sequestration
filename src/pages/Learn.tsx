import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { LEARN_ARTICLES, LEARN_CATEGORIES } from '../lib/learnContent'

export function Learn() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Learn About Soil Carbon"
        subtitle="Short, plain-language explanations — no farming or science background needed."
      />

      {LEARN_CATEGORIES.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 text-xl">{cat}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARN_ARTICLES.filter((a) => a.category === cat).map((a) => (
              <Link
                key={a.slug}
                to={`/app/learn/${a.slug}`}
                className="card card-hover group flex flex-col p-5"
              >
                <span className="w-fit rounded-xl bg-soil-light p-2.5 text-soil-dark">
                  <Icon name={a.icon} className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-base font-semibold text-forest-700">{a.title}</h3>
                <p className="mt-1 flex-1 text-sm text-ink-soft">{a.summary}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest-600 group-hover:gap-2 transition-all">
                  Read <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
