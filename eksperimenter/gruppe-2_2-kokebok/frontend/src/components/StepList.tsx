import type { RecipeStep } from '../types/Recipe'

interface Props {
  steps: RecipeStep[]
}

export default function StepList({ steps }: Props) {
  if (steps.length === 0) return null
  return (
    <ol className="step-list">
      {steps.map((step, i) => (
        <li key={i}>{step.instruction}</li>
      ))}
    </ol>
  )
}
