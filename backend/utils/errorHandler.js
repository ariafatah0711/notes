export const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ error: "Internal Server Error" });
};
