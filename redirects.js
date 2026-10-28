/**
 * One Click Download India - Legacy Permalink Redirect Handler
 */
(function(){
  var p = window.location.pathname;
  var redirects = {
    '/2026/10/download-winscp-free-windows.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/winscp-free-download-windows-sftp-client.html',
    '/2026/10/winscp-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/winscp-free-download-windows-sftp-client.html',
    '/2026/10/calibre-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/download-calibre-ebook-manager-free.html',
    '/2026/10/vlc-media-player-free-download-review.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/vlc-media-player-free-download-windows-review.html',
    '/2026/10/7zip-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/7-zip-free-download-windows-review.html',
    '/2026/10/peazip-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/peazip-free-download-windows.html',
    '/2026/10/wireshark-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/download-wireshark-network-analyzer-free.html',
    '/2026/10/hwinfo-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/hwinfo64-free-download-windows-hardware-monitor.html',
    '/2026/10/sharex-download-free.html': 'https://oneclickdownloadindia.blogspot.com/2026/10/sharex-free-download-windows.html'
  };
  if (redirects[p]) {
    window.location.replace(redirects[p]);
  }
})();