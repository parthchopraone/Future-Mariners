import React, { ReactElement, ReactNode, Ref } from "react";

type SlotProps = {
  children: ReactNode;
  ref?: Ref<HTMLElement>;
};

export function Slot({ children, ref, ...props }: SlotProps) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const originalRef = (children as ReactElement<{ ref?: Ref<HTMLElement> }>).props.ref;

  return React.cloneElement(children as ReactElement<Record<string, unknown>>, {
    ...props,
    ref: (node: HTMLElement) => {
      // Forward outer ref
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        ref.current = node;
      }

      // Preserve child's original ref
      if (typeof originalRef === "function") {
        originalRef(node);
      } else if (originalRef && "current" in originalRef) {
        originalRef.current = node;
      }
    },
  });
}
