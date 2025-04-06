import { CheckCircle2 } from "lucide-react"

interface StepProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepProgressIndicator({ currentStep, totalSteps }: StepProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index + 1 < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1 < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`text-xs mt-1 ${
                index + 1 === currentStep ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {index === 0 ? "Room Details" : index === 1 ? "Room Layout" : index === 2 ? "Save Room" : "Preview"}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-muted w-full rounded-full"></div>
        <div
          className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

