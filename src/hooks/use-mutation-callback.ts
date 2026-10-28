import { toast } from "sonner";

import { parseApiError } from "@/lib/config/api.helper";

type ActionMode =
  | "create"
  | "update"
  | "delete"
  | "change"
  | "assigned"
  | string;

interface UseCrudCallbacksParams {
  entityName: string;
  onClose?: () => void;
}

type SideEffect = () => void;
type SideEffects = SideEffect | SideEffect[] | undefined;

interface BuildCallbackEffects {
  onSuccess?: SideEffects;
  onError?: SideEffects;
  successMessage?: string;
  errorMessage?: string;
}

const runEffects = (effects?: SideEffects) => {
  if (!effects) return;
  if (Array.isArray(effects)) {
    effects.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error("SideEffectError:", e);
      }
    });
  } else {
    try {
      effects();
    } catch (e) {
      console.error("SideEffectError:", e);
    }
  }
};

// parseApiError (not normalizeError): shows the backend's message, or a generic one for network
// failures and unexpected responses, so raw errors ("Network Error", JSON dumps) never reach users.
const getErrorMessage = (err?: unknown) => {
  if (!err) return "Please try again.";
  return parseApiError(err).message || "Please try again.";
};

export const useMutationCallbacks = ({
  entityName,
  onClose,
}: UseCrudCallbacksParams) => {
  const buildCallbacks = (
    mode: ActionMode,
    subject: string,
    effects?: BuildCallbackEffects,
  ) => ({
    onSuccess: () => {
      toast.success(
        effects?.successMessage ?? `${entityName} ${mode}d`,
        effects?.successMessage
          ? undefined
          : {
              description: `${subject} ${
                mode === "delete"
                  ? "deleted"
                  : mode === "update"
                    ? "updated"
                    : "created"
              } successfully.`,
            },
      );
      runEffects(effects?.onSuccess);
      onClose?.();
    },
    onError: (error?: unknown) => {
      toast.error(effects?.errorMessage ?? `${entityName} ${mode} failed`, {
        description: getErrorMessage(error),
      });
      runEffects(effects?.onError);
    },
  });

  return { buildCallbacks };
};
