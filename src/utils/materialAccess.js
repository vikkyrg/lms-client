import api from '../services/api';

/**
 * Authenticated course-material access.
 *
 * `/materials/:id/download` is protected: it requires the student's JWT and
 * validates the approved 3-month access window on the server. A plain <a href>
 * navigation cannot send an Authorization header, so the file is fetched with
 * the shared axios instance (which attaches the bearer token) and handed to the
 * browser through an object URL. This keeps the token out of URLs and logs.
 */
const toBlobError = async (blob) => {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return parsed?.message || 'Unable to open this document.';
  } catch (e) {
    return 'Unable to open this document.';
  }
};

export const fetchMaterialBlob = async (materialId, { inline = false } = {}) => {
  let res;
  try {
    res = await api.get(`/materials/${materialId}/download`, {
      params: inline ? { inline: 'true' } : {},
      responseType: 'blob'
    });
  } catch (err) {
    // Error bodies arrive as Blobs because the request expects binary data.
    const payload = err?.response?.data;
    if (payload instanceof Blob) {
      throw new Error(await toBlobError(payload));
    }
    throw err;
  }

  const type = res.headers?.['content-type'] || 'application/pdf';
  if (type.includes('application/json')) {
    throw new Error(await toBlobError(res.data));
  }
  return { blob: new Blob([res.data], { type }), type };
};

const triggerBrowserDownload = (blobUrl, fileName) => {
  const link = window.document.createElement('a');
  link.href = blobUrl;
  link.download = fileName || 'course-material';
  window.document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * View a material in a new tab (inline) or download it.
 * Returns the created object URL so callers can revoke it if they like.
 */
export const openMaterial = async (material, { inline = false } = {}) => {
  const { blob } = await fetchMaterialBlob(material._id, { inline });
  const url = window.URL.createObjectURL(blob);

  if (inline) {
    const opened = window.open(url, '_blank', 'noopener');
    if (!opened) window.alert('Please allow pop-ups to view this course PDF.');
  } else {
    triggerBrowserDownload(url, material.fileName || `${material.title}.pdf`);
  }

  // Give the browser a moment to start loading before releasing the URL.
  window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  return url;
};
