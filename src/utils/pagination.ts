export const getPagination = (page?: string, limit?: string) => {
  const pageNumber = Math.max(Number(page ?? 1), 1);
  const take = Math.min(Math.max(Number(limit ?? 20), 1), 100);
  const skip = (pageNumber - 1) * take;

  return { page: pageNumber, limit: take, skip, take };
};
