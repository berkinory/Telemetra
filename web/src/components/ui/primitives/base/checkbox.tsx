'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react/checkbox';
import {
  type HTMLMotionProps,
  motion,
  type SVGMotionProps,
} from 'motion/react';
import type { ComponentProps } from 'react';
import { useControlledState } from '@/hooks/use-controlled-state';
import { getStrictContext } from '@/lib/get-strict-context';

type CheckboxContextType = {
  isChecked: boolean;
  setIsChecked: CheckboxProps['onCheckedChange'];
  isIndeterminate: boolean | undefined;
};

const [CheckboxProvider, useCheckbox] =
  getStrictContext<CheckboxContextType>('CheckboxContext');

type CheckboxProps = Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  'render'
> &
  HTMLMotionProps<'button'>;

function Checkbox({
  name,
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate,
  value,
  nativeButton,
  parent,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  ...props
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useControlledState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <CheckboxProvider
      value={{ isChecked, setIsChecked, isIndeterminate: indeterminate }}
    >
      <CheckboxPrimitive.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        indeterminate={indeterminate}
        inputRef={inputRef}
        name={name}
        nativeButton={nativeButton}
        onCheckedChange={setIsChecked}
        parent={parent}
        readOnly={readOnly}
        render={
          <motion.button
            data-slot="checkbox"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
          />
        }
        required={required}
        value={value}
      />
    </CheckboxProvider>
  );
}

type CheckboxIndicatorProps = SVGMotionProps<SVGSVGElement>;

function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const { isChecked, isIndeterminate } = useCheckbox();

  return (
    <CheckboxPrimitive.Indicator
      keepMounted
      render={
        <motion.svg
          animate={isChecked ? 'checked' : 'unchecked'}
          aria-hidden="true"
          data-slot="checkbox-indicator"
          fill="none"
          initial="unchecked"
          stroke="currentColor"
          strokeWidth="3.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          {isIndeterminate ? (
            <motion.line
              animate={{
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.2 },
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              strokeLinecap="round"
              x1="5"
              x2="19"
              y1="12"
              y2="12"
            />
          ) : (
            <motion.path
              d="M4.5 12.75l6 6 9-13.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                checked: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.2,
                    delay: 0.2,
                  },
                },
                unchecked: {
                  pathLength: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
            />
          )}
        </motion.svg>
      }
    />
  );
}

export {
  Checkbox,
  CheckboxIndicator,
  useCheckbox,
  type CheckboxProps,
  type CheckboxIndicatorProps,
  type CheckboxContextType,
};
