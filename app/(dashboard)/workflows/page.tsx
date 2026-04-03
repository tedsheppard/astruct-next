'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  DollarSign,
  ListChecks,
  ArrowLeftRight,
  FileText,
  FileSearch,
  CalendarClock,
  CheckCircle,
  Plus,
} from 'lucide-react'

const workflows = [
  {
    title: 'Draft a Notice of Delay',
    description: 'Generate a formal delay notice with clause references',
    icon: Clock,
  },
  {
    title: 'Draft a Payment Claim',
    description: 'Create a payment claim with amounts and references',
    icon: DollarSign,
  },
  {
    title: 'Extract Contract Obligations',
    description: 'AI extracts all time-bars, deadlines, and notice requirements',
    icon: ListChecks,
  },
  {
    title: 'Review Variation Proposal',
    description: 'Analyze a variation against contract terms',
    icon: ArrowLeftRight,
  },
  {
    title: 'Generate Contract Summary',
    description: 'Executive summary of key terms, dates, and parties',
    icon: FileText,
  },
  {
    title: 'Compare Contract Amendments',
    description: 'Show differences between contract versions',
    icon: FileSearch,
  },
  {
    title: 'Draft an EOT Claim',
    description: 'Extension of Time claim with supporting references',
    icon: CalendarClock,
  },
  {
    title: 'Proofread Notice',
    description: 'Check grammar, formatting, and clause reference accuracy',
    icon: CheckCircle,
  },
]

export default function WorkflowsPage() {
  const router = useRouter()

  function handleRun(title: string) {
    const message = encodeURIComponent(title)
    router.push(`/?workflow=${message}`)
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Workflows
        </h1>
        <p className="text-sm mt-1 text-muted-foreground">
          Pre-built construction intelligence workflows
        </p>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => {
          const Icon = workflow.icon
          return (
            <Card
              key={workflow.title}
              className="bg-card border border-border rounded-xl hover:border-ring transition-colors group"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon
                    className="h-5 w-5 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  {workflow.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {workflow.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full btn-press"
                  onClick={() => handleRun(workflow.title)}
                >
                  Run
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Custom Workflows Section */}
      <div>
        <Card className="bg-card border border-border border-dashed rounded-xl">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus
                className="h-6 w-6 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="font-medium text-foreground mb-1">
              Custom Workflows
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Create your own workflows tailored to your contracts. Coming Q3
              2026.
            </p>
            <Button variant="outline" size="sm" disabled>
              Create Workflow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
