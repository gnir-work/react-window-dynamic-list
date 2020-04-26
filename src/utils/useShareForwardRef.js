import { useEffect, useRef } from "react";

/**
 * This hooks allows the component to hold a ref while also exposing the same ref to its parents.
 * For example:
 * const MyComponent = (props, ref) => {
 *   const innerRef = useShareForwardedRef(ref);
 *
 *   ...
 *
 *   return <div ref={ref}>
 *    ...
 *   </div>
 * }
 *
 * https://gist.github.com/pie6k/b4717f392d773a71f67e110b42927fea
 */
const useShareForwardedRef = (forwardedRef) => {
  // final ref that will share value with forward ref. this is the one we will attach to components
  const innerRef = useRef(null);

  // after every render - try to share current ref value with forwarded ref
  useEffect(() => {
    if (!forwardedRef) {
      return;
    }
    if (typeof forwardedRef === "function") {
      forwardedRef(innerRef.current);
    } else {
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
};

export default useShareForwardedRef;
