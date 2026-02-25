import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react';

import { cn } from '@/lib/utils';

type IconProps = HugeiconsIconProps & {
  className?: string;
};

function Icon({ className, strokeWidth = 2, size = 16, ...props }: IconProps) {
  return (
    <HugeiconsIcon className={cn(className)} strokeWidth={strokeWidth} size={size} {...props} />
  );
}

export { Icon, type IconProps };
