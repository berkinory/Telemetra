'use client';

import { Switch as SwitchPrimitives } from '@base-ui-components/react/switch';
import {
  type HTMLMotionProps,
  motion,
  type TargetAndTransition,
  type VariantLabels,
} from 'motion/react';
import { type ComponentProps, useMemo, useState } from 'react';
import { useControlledState } from '@/hooks/use-controlled-state';
import { getStrictContext } from '@/lib/get-strict-context';

type SwitchContextType = {
  isChecked: boolean;
  setIsChecked: SwitchProps['onCheckedChange'];
  isPressed: boolean;
  setIsPressed: (isPressed: boolean) => void;
};

const [SwitchProvider, useSwitch] =
  getStrictContext<SwitchContextType>('SwitchContext');

type SwitchProps = Omit<
  ComponentProps<typeof SwitchPrimitives.Root>,
  'render'
> &
  HTMLMotionProps<'button'>;

function Switch({
  name,
  defaultChecked,
  checked,
  onCheckedChange,
  nativeButton,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  ...props
}: SwitchProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isChecked, setIsChecked] = useControlledState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <SwitchProvider
      value={{ isChecked, setIsChecked, isPressed, setIsPressed }}
    >
      <SwitchPrimitives.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        inputRef={inputRef}
        name={name}
        nativeButton={nativeButton}
        onCheckedChange={setIsChecked}
        readOnly={readOnly}
        render={
          <motion.button
            data-slot="switch"
            initial={false}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
            onTapStart={() => setIsPressed(true)}
            whileTap="tap"
            {...props}
          />
        }
        required={required}
      />
    </SwitchProvider>
  );
}

type SwitchThumbProps = Omit<
  ComponentProps<typeof SwitchPrimitives.Thumb>,
  'render'
> &
  HTMLMotionProps<'div'> & {
    pressedAnimation?: TargetAndTransition | VariantLabels | boolean;
  };

function SwitchThumb({
  pressedAnimation,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  ...props
}: SwitchThumbProps) {
  const { isPressed } = useSwitch();

  return (
    <SwitchPrimitives.Thumb
      render={
        <motion.div
          animate={isPressed ? pressedAnimation : undefined}
          data-slot="switch-thumb"
          layout
          transition={transition}
          whileTap="tab"
          {...props}
        />
      }
    />
  );
}

type SwitchIconPosition = 'left' | 'right' | 'thumb';

type SwitchIconProps = HTMLMotionProps<'div'> & {
  position: SwitchIconPosition;
};

function SwitchIcon({
  position,
  transition = { type: 'spring', bounce: 0 },
  ...props
}: SwitchIconProps) {
  const { isChecked } = useSwitch();

  const isAnimated = useMemo(() => {
    if (position === 'right') {
      return !isChecked;
    }
    if (position === 'left') {
      return isChecked;
    }
    if (position === 'thumb') {
      return true;
    }
    return false;
  }, [position, isChecked]);

  return (
    <motion.div
      animate={isAnimated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      data-slot={`switch-${position}-icon`}
      transition={transition}
      {...props}
    />
  );
}

export {
  Switch,
  SwitchThumb,
  SwitchIcon,
  useSwitch,
  type SwitchProps,
  type SwitchThumbProps,
  type SwitchIconProps,
  type SwitchIconPosition,
  type SwitchContextType,
};
