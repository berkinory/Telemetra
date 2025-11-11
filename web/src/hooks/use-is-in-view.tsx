import { type UseInViewOptions, useInView } from 'motion/react';
import { type Ref, type RefObject, useImperativeHandle, useRef } from 'react';

type UseIsInViewOptions = {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
};

function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: Ref<T>,
  options: UseIsInViewOptions = {}
): { ref: RefObject<T | null>; isInView: boolean } {
  const { inView, inViewOnce = false, inViewMargin = '0px' } = options;
  const localRef = useRef<T>(null);
  useImperativeHandle(ref, () => localRef.current as T);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
  return { ref: localRef, isInView };
}

export { useIsInView, type UseIsInViewOptions };
