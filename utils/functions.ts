export function formDataAsDict(event: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(event.currentTarget);
  let data: any = {};

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
