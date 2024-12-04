import z from "zod";

export const resolveIdLikeRequest = (idLike: string) => {
  const isId = z.string().uuid().safeParse(idLike).success;
  return `${isId ? "id" : "urlName"}/${idLike}`;
};
