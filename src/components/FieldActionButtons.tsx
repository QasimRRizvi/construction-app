import { Check, X } from "lucide-react";

import Button from "./ui/Button";

interface Props {
  cancelLabel: string;
  successLabel: string;
  onCancle: () => void;
  onSuccess: () => void;
}

const FieldActionButtons = ({cancelLabel, successLabel, onCancle, onSuccess }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onSuccess}
        color="success"
        className="!p-1"
        aria-label={successLabel}
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        onClick={onCancle}
        color="secondary"
        className="!p-1"
        aria-label={cancelLabel}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default FieldActionButtons;