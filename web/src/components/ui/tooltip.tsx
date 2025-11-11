import {
  TooltipArrow as TooltipArrowPrimitive,
  TooltipPopup as TooltipPopupPrimitive,
  type TooltipPopupProps as TooltipPopupPrimitiveProps,
  TooltipPortal as TooltipPortalPrimitive,
  TooltipPositioner as TooltipPositionerPrimitive,
  type TooltipPositionerProps as TooltipPositionerPrimitiveProps,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  TooltipProvider as TooltipProviderPrimitive,
  type TooltipProviderProps as TooltipProviderPrimitiveProps,
  TooltipTrigger as TooltipTriggerPrimitive,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
} from '@/components/ui/primitives/base/tooltip';
import { cn } from '@/lib/utils';

type TooltipProviderProps = TooltipProviderPrimitiveProps;

function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return <TooltipProviderPrimitive delay={delay} {...props} />;
}

type TooltipProps = TooltipPrimitiveProps & {
  delay?: TooltipPrimitiveProps['delay'];
};

function Tooltip({ delay = 0, ...props }: TooltipProps) {
  return (
    <TooltipProvider delay={delay}>
      <TooltipPrimitive {...props} />
    </TooltipProvider>
  );
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps;

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipTriggerPrimitive {...props} />;
}

type TooltipPanelProps = TooltipPositionerPrimitiveProps &
  TooltipPopupPrimitiveProps;

function TooltipPanel({
  className,
  sideOffset = 4,
  children,
  style,
  ...props
}: TooltipPanelProps) {
  return (
    <TooltipPortalPrimitive>
      <TooltipPositionerPrimitive
        className="z-50"
        sideOffset={sideOffset}
        {...props}
      >
        <TooltipPopupPrimitive
          className={cn(
            'w-fit origin-(--transform-origin) text-balance rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs',
            className
          )}
          style={style}
        >
          {children}
          <TooltipArrowPrimitive className="data-[side='bottom']:-top-[4px] data-[side='right']:-left-[4px] data-[side='left']:-right-[4px] data-[side='inline-start']:-right-[4px] data-[side='inline-end']:-left-[4px] z-50 size-2.5 rotate-45 rounded-[2px] bg-primary fill-primary" />
        </TooltipPopupPrimitive>
      </TooltipPositionerPrimitive>
    </TooltipPortalPrimitive>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipPanel,
  type TooltipProps,
  type TooltipTriggerProps,
  type TooltipPanelProps,
};
