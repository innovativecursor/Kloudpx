export const generateSlug = (text) => {
  return encodeURIComponent(
    text
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
  );
};
