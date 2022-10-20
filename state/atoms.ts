import { atom } from "recoil";

export const apiErrorsAtom = atom<ApiError>({
  key: "apiErrorsAtom",
  default: {},
});

export const otherErrorAtom = atom({
  key: "otherErrorAtom",
  default: {},
});

export const successStringAtom = atom({
  key: "successStringAtom",
  default: "",
});

export const optionsSaleSelectedAtom = atom<CompleteSale>({
  key: "optionsSaleSelectedAtom",
  default: undefined,
});
