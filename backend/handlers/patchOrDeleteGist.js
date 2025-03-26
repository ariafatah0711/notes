// import { GITHUB_API, headers, fakeheaders } from "../utils/apiConfig.js";

// export const handlePatchOrDelete = async (req, res, gistId) => {
//   const response = await fetch(`${GITHUB_API}/${gistId}`, {
//     method: req.method,
//     // headers,
//     fakeheaders,
//     body: JSON.stringify(req.body),
//   });

//   if (req.method === "DELETE") {
//     if (!response.ok) {
//       return await response.json().catch(() => ({ status: 409, message: "Gist deleted Not successfully" }));
//       // return res.status(response.status).json({ status: 409, message: "Gist deleted Not successfully" });
//     }
//     return res.status(response.status).json({ message: "Gist deleted successfully" });
//   }

//   if (!response.ok) {
//     const errorMessage = await response.json().catch(() => ({ error: "Unknown Error" }));
//     return res.status(response.status).json(errorMessage);
//   }

//   // if (req.method === "DELETE") {
//   //   return res.status(response.status).json({ message: "Gist deleted successfully" });
//   // }

//   const data = await response.json();
//   return res.status(response.status).json(data);
// };

import { GITHUB_API, headers, fakeheaders } from "../utils/apiConfig.js";

export const handlePatchOrDelete = async (req, res, gistId) => {
  try {
    const response = await fetch(`${GITHUB_API}/${gistId}`, {
      method: req.method,
      headers: headers,
      body: req.method !== "DELETE" ? JSON.stringify(req.body) : undefined,
    });

    // Handle unsuccessful responses for non-DELETE methods
    if (!response.ok && req.method !== "DELETE") {
      const errorMessage = await response.json().catch(() => ({ error: "Unknown Error" }));
      return res.status(response.status).json(errorMessage);
    }

    // If the method is DELETE, check the response status
    if (req.method === "DELETE") {
      if (!response.ok) {
        const errorMessage = await response.json().catch(() => ({ status: 409, message: "Gist deletion was not successful" }));
        return res.status(409).json(errorMessage);
      }

      // If the response is OK, return success message
      return res.status(response.status).json({ message: "Gist deleted successfully" });
    }

    // For methods like PATCH, return the data from the response.
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error during PATCH or DELETE:", error);
    return res.status(500).json({ error: "Server Internal Error" });
  }
};
