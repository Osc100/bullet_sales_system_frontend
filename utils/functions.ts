export function formDataAsDict(event: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(event.currentTarget);
  let data: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

export function popFromDict(
  dict: Record<string, any>,
  key: string
): [object, any] {
  let newDict = { ...dict };
  let poppedKey = dict[key];
  delete newDict[key];

  return [newDict, poppedKey];
}

export const generateAxiosConfig = (window: Window) => {
  console.log(window.sessionStorage.getItem("token"));
  return {
    headers: { Authorization: window.sessionStorage.getItem("token") ?? false },
  };
};

export function cleanErrorData(errorData: any) {
  let cleanError = {};

  for (const [key, value] of Object.entries(errorData)) {
    if (Array.isArray(value)) {
      cleanError[key] = value[0];
    } else if (typeof value === "object" && value !== null) {
      cleanError[key] = cleanErrorData(value);
    }
  }

  return cleanError;
}
