export function getResumeApiPath(id: string) {
  return `/api/resume/${id}`;
}

export function getResumeDownloadApiPath(id: string) {
  return `/api/resume/${id}?download=1`;
}
