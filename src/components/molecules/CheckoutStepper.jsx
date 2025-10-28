import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CheckoutStepper = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  isCompleted && "bg-primary text-white",
                  isCurrent && "bg-primary text-white ring-4 ring-primary/20",
                  isUpcoming && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  (isCompleted || isCurrent) && "text-primary",
                  isUpcoming && "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-4 transition-colors duration-200",
                  isCompleted ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;