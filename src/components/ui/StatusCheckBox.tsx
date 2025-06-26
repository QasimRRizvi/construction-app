import React from 'react';
import {
  Hourglass,
  Ban,
  Clock,
  Check,
} from 'lucide-react';
import clsx from 'clsx';
import { ChecklistStatus } from '../../constants';

interface StatusCheckBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  status: ChecklistStatus;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<ChecklistStatus, { icon: React.ReactNode; color: string }> = {
  [ChecklistStatus.NotStarted]: {
    icon: null,
    color: 'border-gray-400',
  },
  [ChecklistStatus.InProgress]: {
    icon: <Hourglass className="w-4 h-4 text-yellow-500" />,
    color: 'border-yellow-500',
  },
  [ChecklistStatus.Blocked]: {
    icon: <Ban className="w-4 h-4 text-red-500" />,
    color: 'border-red-500',
  },
  [ChecklistStatus.FinalCheckAwaiting]: {
    icon: <Clock className="w-4 h-4 text-green-400" />,
    color: 'border-green-400',
  },
  [ChecklistStatus.Done]: {
    icon: <Check className="w-4 h-4 text-green-600" />,
    color: 'border-green-600',
  },
};

const StatusCheckBox: React.FC<StatusCheckBoxProps> = ({
  status,
  className,
  onClick,
  disabled = false,
  ...rest
}) => {
  const config = statusConfig[status];

  return (
    <div
      className={clsx(
        'w-6 h-6 rounded-md border flex items-center justify-center transition-colors',
        config.color,
        {
          'cursor-pointer hover:bg-gray-50': !disabled,
          'opacity-50 cursor-not-allowed pointer-events-none': disabled,
        },
        className
      )}
      onClick={!disabled ? onClick : undefined}
      {...rest}
    >
      {config.icon}
    </div>
  );
};

export default StatusCheckBox;
