import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  backLink?: ReactNode
}

export function PageHeader({ title, description, actions, backLink }: PageHeaderProps) {
  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          {backLink && <div>{backLink}</div>}
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions && <div className="ml-auto">{actions}</div>}
      </div>
    </div>
  )
}

