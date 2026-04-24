import type { RecipeStep } from '../types/Recipe'

interface Props {
  steps: RecipeStep[]
  onChange: (steps: RecipeStep[]) => void
}

export default function StepFormList({ steps, onChange }: Props) {
  const update = (index: number, instruction: string) => {
    onChange(steps.map((s, i) => (i === index ? { ...s, instruction } : s)))
  }

  const add = () => {
    onChange([...steps, { stepNumber: steps.length + 1, instruction: '' }])
  }

  const remove = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, stepNumber: i + 1 }))
    onChange(updated)
  }

  return (
    <div className="step-list">
      {steps.map((step, i) => (
        <div key={i} className="step-row">
          <span className="step-number">{step.stepNumber}.</span>
          <textarea
            value={step.instruction}
            placeholder="Beskriv trinnet"
            onChange={e => update(i, e.target.value)}
            rows={2}
          />
          <button type="button" onClick={() => remove(i)}>Fjern</button>
        </div>
      ))}
      <button type="button" onClick={add}>Legg til trinn</button>
    </div>
  )
}
