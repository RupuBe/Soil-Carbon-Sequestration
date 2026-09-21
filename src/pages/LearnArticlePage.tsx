import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { EmptyState } from '../components/states'
import { LEARN_ARTICLES } from '../lib/learnContent'

export function LearnArticlePage() {
  const { slug } = useParams()
  const article = LEARN_ARTICLES.find((a) => a.slug === slug)
  const related = LEARN_ARTICLES.filter((a) => a.category === article?.category && a.slug !== slug).slice(0, 3)

  if (!article) {
    return (
      <EmptyState
        title="Article not found"
        message="That topic doesn’t exist yet."
        action={
          <Link to="/app/learn" className="btn-primary">
            Back to Learn
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/app/learn" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-forest-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All topics
      </Link>

      <PageHeader title={article.title} subtitle={`${article.category} · ${article.summary}`} />

      <article className="card max-w-2xl p-6 sm:p-8">
        <span className="w-fit rounded-xl bg-soil-light p-3 text-soil-dark">
          <Icon name={article.icon} className="h-6 w-6" aria-hidden />
        </span>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-soft">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg">More in {article.category}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <Link key={a.slug} to={`/app/learn/${a.slug}`} className="card card-hover p-4">
                <h3 className="text-sm font-semibold text-forest-700">{a.title}</h3>
                <p className="mt-1 text-xs text-ink-soft">{a.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
