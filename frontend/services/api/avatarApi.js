import { API_BASE_URL, AVATAR_ENDPOINT } from "./config";

export class AvatarApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "AvatarApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Sends avatar generation request to the backend.
 * @param {{ photo: File, script: string, look: string, voice: string }} payload
 * @returns {Promise<{ video_url: string }>}
 */
export async function createAvatarVideo({ photo, script, look, voice }) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("script", script);
  formData.append("look", look);
  formData.append("voice", voice);
  const response = await fetch(`${API_BASE_URL}${AVATAR_ENDPOINT}`, {
    method: "POST",
    body: formData,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Failed to generate video";
    throw new AvatarApiError(message, response.status, data);
  }

  const videoUrl = data?.data?.video_url;

  if (!videoUrl) {
    throw new AvatarApiError(
      "Invalid API response: missing video_url",
      response.status,
      data,
    );
  }
  return { video_url: videoUrl };
}
