// Image utility functions for handling different backend configurations
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// Derive a sensible BASE_URL even if only API base is provided
const deriveBaseUrl = () => {
  const envBase = import.meta.env.VITE_BASE_URL;
  if (envBase && typeof envBase === "string") return envBase;
  const api = API_BASE_URL;
  // Strip trailing /api if present
  try {
    if (api.endsWith("/api")) return api.slice(0, -4);
    return api;
  } catch (_) {
    return "http://localhost:5000";
  }
};
const BASE_URL = deriveBaseUrl();

/**
 * Get the proper image URL from various possible backend configurations
 * @param {Object|string} imageData - Could be a book object, user object, or direct image path
 * @param {string} imageType - Type of image: 'cover', 'profile', 'book'
 * @returns {string} - Proper image URL or empty string for fallback
 */
export const getImageUrl = (imageData, imageType = "cover") => {
  // Debug logging
  console.log("getImageUrl called with:", { imageData, imageType });

  if (!imageData) {
    console.log("No image data provided");
    return "";
  }

  let imagePath = "";

  // Handle different input types
  if (typeof imageData === "string") {
    imagePath = imageData;
  } else if (typeof imageData === "object") {
    // Extract image path based on type
    switch (imageType) {
      case "profile":
        imagePath = imageData.profilePhoto || imageData.avatar || "";
        break;
      case "cover":
      case "book":
        imagePath =
          imageData.coverImageUrl ||
          imageData.coverImage ||
          imageData.image ||
          "";
        break;
      default:
        imagePath =
          imageData.coverImageUrl ||
          imageData.coverImage ||
          imageData.profilePhoto ||
          imageData.image ||
          "";
    }
  }

  console.log("Extracted image path:", imagePath);

  if (!imagePath) {
    console.log("No image path found");
    return "";
  }

  // If it's a blob URL (for preview), use it as-is
  if (imagePath.startsWith("blob:")) {
    console.log("Using blob URL:", imagePath);
    return imagePath;
  }

  // If it's already a full URL, use it as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    console.log("Using full URL:", imagePath);
    return imagePath;
  }

  // Handle relative paths - try different common patterns
  const possiblePaths = [
    imagePath,
    `uploads/${imagePath}`,
    `uploads/books/${imagePath}`,
    `uploads/profiles/${imagePath}`,
    `static/${imagePath}`,
    `public/uploads/${imagePath}`,
    `api/uploads/${imagePath}`,
  ];

  // For now, try the most common pattern
  let finalUrl = "";
  if (imagePath.startsWith("/")) {
    // Use BASE_URL for static files, not API_BASE_URL
    finalUrl = `${BASE_URL}${imagePath}`;
  } else {
    // Try different patterns based on image type
    if (imageType === "profile") {
      finalUrl = `${BASE_URL}/uploads/profiles/${imagePath}`;
    } else {
      finalUrl = `${BASE_URL}/uploads/books/${imagePath}`;
    }
  }

  console.log("Generated URL:", finalUrl);
  return finalUrl;
};

/**
 * Create an enhanced image component with fallback
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @param {string} fallbackType - Type of fallback: 'book', 'profile'
 * @returns {HTMLElement} - Image element with error handling
 */
export const createImageWithFallback = (
  src,
  alt,
  className,
  fallbackType = "book"
) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = className;

  img.onerror = () => {
    console.log("Image failed to load:", src);
    const fallbackElement = document.createElement("div");
    fallbackElement.className =
      "flex items-center justify-center w-full h-full";

    switch (fallbackType) {
      case "profile":
        fallbackElement.innerHTML =
          '<svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
        break;
      case "book":
      default:
        fallbackElement.innerHTML =
          '<div class="text-4xl text-gray-400">📖</div>';
    }

    img.parentElement?.replaceChild(fallbackElement, img);
  };

  return img;
};

/**
 * Test if an image URL is accessible
 * @param {string} url - Image URL to test
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const testImageUrl = async (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully:", url);
      resolve(true);
    };
    img.onerror = () => {
      console.log("Image failed to load:", url);
      resolve(false);
    };
    img.src = url;
  });
};

/**
 * Get the best available image URL by testing multiple patterns
 * @param {Object|string} imageData - Image data
 * @param {string} imageType - Type of image
 * @returns {Promise<string>} - Best available image URL
 */
export const getBestImageUrl = async (imageData, imageType = "cover") => {
  if (!imageData) return "";

  let imagePath = "";

  if (typeof imageData === "string") {
    imagePath = imageData;
  } else {
    switch (imageType) {
      case "profile":
        imagePath = imageData.profilePhoto || imageData.avatar || "";
        break;
      case "cover":
      case "book":
        imagePath = imageData.coverImageUrl || imageData.coverImage || "";
        break;
    }
  }

  if (!imagePath) return "";

  // If it's already a full URL or blob, return as-is
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:")) {
    return imagePath;
  }

  // Test different URL patterns using BASE_URL for static files
  const patterns = [
    `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`,
    `${BASE_URL}/uploads/${imagePath}`,
    `${BASE_URL}/uploads/books/${imagePath}`,
    `${BASE_URL}/uploads/profiles/${imagePath}`,
    `${BASE_URL}/static/${imagePath}`,
    `${BASE_URL}/public/uploads/${imagePath}`,
  ];

  for (const url of patterns) {
    const isAccessible = await testImageUrl(url);
    if (isAccessible) {
      return url;
    }
  }

  // If no URL works, return empty string for fallback
  return "";
};
