'use client';
import React from "react";

const useFormState = (fn: Function, options: any) => {
  const [state, setState] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const { onSuccess } = options;
  const actions = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const result = await fn(formData);
    if (result?.status !== 200) {
      setError(result?.message);
    } else {
      setState(result);
      onSuccess(result)
    }
  };
  return {
    state,
    error,
    actions
  };
}

export default useFormState;
