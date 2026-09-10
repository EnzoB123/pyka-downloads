// Public release metadata only. No credentials or backend dependency.
async function loadDownload() {
  const status = document.getElementById('release-status');
  const button = document.getElementById('download');
  try {
    const response = await fetch('https://api.github.com/repos/EnzoB123/pyka-downloads/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404) {
      status.textContent = 'No public release available yet. Check back soon.';
      return;
    }
    if (!response.ok) throw new Error('Release lookup failed');
    const release = await response.json();
    const installer = release.assets?.find((asset) => asset.name.endsWith('.exe'));
    const url = new URL(installer?.browser_download_url);
    if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/EnzoB123/pyka-downloads/releases/download/')) {
      throw new Error('No trusted Windows installer');
    }
    button.href = url.href;
    button.textContent = 'Download for Windows ↓';
    status.textContent = `${release.tag_name} · Windows 64-bit · Preview`;
  } catch {
    status.textContent = 'View releases to check available Windows downloads.';
  }
}
loadDownload();
