/**
 * One Click Download India - Core Global Client-Side JavaScript
 * Theme Switcher, Autocomplete Search, Keyboard Shortcuts, Snippet Sanitizer
 */
(function() {
  var themeToggleBtn = document.getElementById('theme-toggle-btn');
  var themeIcon = document.getElementById('theme-icon');
  var themeLabel = document.getElementById('theme-label');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('portal_theme'); } catch(e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Light';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Dark';
    }
  }
  applyTheme(currentTheme);
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portal_theme', next); } catch(e) {}
      applyTheme(next);
    });
  }

  /* Clean any raw Blogger snippet boilerplate or legacy bylines on listing cards */
  var cleanDescMap = {
    'system informer': 'Open-source Windows task manager, live kernel process monitor, thread debugger, and network socket analyzer with SHA-256 verification.',
    '7-zip': 'Open-source LGPL file archiver with high-ratio LZMA2 compression, 256-bit AES encryption, and built-in SHA-256 checksum tools.',
    'yumi': 'Multiboot USB creator powered by Ventoy 1.1.18 with exFAT support, UEFI Secure Boot, and up to 40 GB Linux persistence.',
    'windirstat': 'Native C++20 disk space analyzer for Windows with direct NTFS Master File Table scanning and interactive treemap visualizers.',
    'calibre': 'Cross-platform open-source eBook library manager, EPUB/AZW3/PDF converter, and 3D bookshelf reader for Windows, Mac, and Linux.',
    'powertoys': 'Official Microsoft open-source utility suite featuring FancyZones window tiling, offline OCR Text Extractor, Peek, and Command Palette.',
    'czkawka': 'Memory-safe Rust duplicate file finder, perceptual similar image matcher, and storage cleaner with Blake3 cryptographic hashing.',
    'losslesscut': 'Zero-reencode video and audio trimmer powered by FFmpeg 8.1 for instantaneous lossless cutting and stream extraction.',
    'putty': 'Lightweight native C SSH and Telnet terminal client for Windows with Pageant key agent, PuTTYgen, and post-quantum ML-KEM key exchange.',
    'gparted': 'Bootable Debian-based live partition manager ISO for non-destructive NTFS, ext4, exFAT, and Btrfs disk resizing and rescue.',
    'gpu-z': 'Graphics card diagnostic and real-time sensor suite reporting silicon die specs, VRAM hotspot thermals, and PCIe bandwidth.',
    'vscodium': 'Community-driven, telemetry-free MIT-licensed binary distribution of Visual Studio Code pre-configured with the Open VSX Registry.',
    'localsend': 'Open-source cross-platform local Wi-Fi file and clipboard sharing app with end-to-end TLS encryption for Windows, Mac, Linux, and Android.',
    'stremio': 'Open-source multimedia center and streaming hub with a Rust/WASM core, hardware-accelerated MPV playback, and OpenSubtitles sync.',
    'bulk crap uninstaller': 'Automated batch software uninstaller for Windows 11/10 removing Win32, UWP Store bloatware, and leftover registry entries.',
    'dbeaver': 'Universal open-source SQL client and database administration workbench supporting 100+ JDBC relational and analytical databases.',
    'upscayl': 'Open-source local AI image upscaler powered by Vulkan NCNN and Real-ESRGAN models with 100% offline GPU processing.',
    'kdenlive': 'Open-source multi-track non-linear video editor built on Qt6 and MLT with Whisper AI subtitling and 4K proxy workflows.',
    'keepassxc': 'Offline KDBX 4.1 desktop password manager with Argon2id key derivation, browser passkeys, TOTP, and built-in SSH agent.',
    'winscp': 'Open-source SFTP, SCP, FTP, WebDAV, and Amazon S3 graphical file transfer client for Windows with AES-256 master password encryption.',
    'qbittorrent': 'Ad-free C++/Qt6 BitTorrent client featuring VPN network interface binding, integrated torrent search, and remote WebUI.',
    'bleachbit': 'Open-source system cleaner, browser SQLite vacuum optimizer, and DoD/Gutmann secure file shredder for Windows and Linux.',
    'krita': 'Professional open-source digital painting, illustration, and 2D frame-by-frame animation studio with CMYK and OpenColorIO support.',
    'sumatra': 'Ultra-lightweight native C++ document reader for Windows supporting PDF, EPUB, MOBI, CBZ, CBR, and DjVu with sub-second startup.',
    'cpu-z': 'Hardware profiling and processor diagnostic utility reporting CPU stepping, cache topology, motherboard BIOS, and DDR4/DDR5 timings.',
    'sharex': 'Open-source screen capture, native Direct3D 120 FPS screen recorder, OCR text extractor, and workflow automation suite.',
    'veracrypt': 'Enterprise-grade open-source on-the-fly disk encryption utility supporting AES-256, Serpent, Twofish, and hidden volumes.',
    'dooble': 'Privacy-first Qt WebEngine browser with AES-256 encrypted history, per-tab cookie isolation, and integrated ad blocking.',
    'clonezilla': 'Bare-metal bootable disk imaging, partition cloning, and multicast deployment suite for Windows, Linux, and macOS drives.',
    'balenaetcher': 'Open-source USB and SD card image flasher with automatic SHA-256 readback verification and system drive wipe protection.',
    'rufus': 'Ultra-compact open-source bootable USB formatting utility for Windows 11/10 ISO media creation and UEFI/GPT flashing.',
    'ventoy': 'Open-source multiboot USB bootloader allowing direct boot from ISO, WIM, IMG, VHD(x), and EFI files without reformatting.',
    'crystaldiskinfo': 'NVMe, SATA SSD, and HDD S.M.A.R.T. health, temperature, and NAND wear-leveling diagnostic monitor for Windows.',
    'hwinfo': 'Comprehensive real-time hardware sensor, motherboard telemetry, and power-rail diagnostic tool for Windows workstations.',
    'everything': 'Instantaneous Windows file and folder search engine powered by direct NTFS Master File Table (MFT) journal indexing.',
    'notepad++': 'Fast native Win32 source code and text editor for Windows with syntax highlighting, multi-file regex search, and plugins.',
    'obs studio': 'Open-source video recording and live streaming studio with hardware NVENC/QSV/AMF encoding and multi-scene mixing.',
    'audacity': 'Cross-platform open-source multi-track audio editor, recorder, and spectral mastering studio for Windows, Mac, and Linux.',
    'handbrake': 'Open-source multi-threaded video transcoder supporting AV1, HEVC 10-bit, x264, and hardware GPU encoding queues.',
    'gimp': 'Cross-platform open-source raster image editor for photo retouching, layer compositing, and non-destructive graphic design.',
    'inkscape': 'Professional open-source SVG vector graphics editor for illustrations, logos, diagrams, and technical typography.',
    'firefox': 'Independent open-source web browser powered by the Quantum/Gecko engine with Enhanced Tracking Protection.',
    'brave': 'Privacy-focused Chromium web browser with built-in ad and tracker blocking, fingerprint protection, and HTTPS upgrades.',
    'tor browser': 'Privacy-hardened browser routing traffic through the encrypted Tor network with anti-fingerprinting isolation.',
    'thunderbird': 'Open-source desktop email, calendar, and PGP/S/MIME encrypted messaging client by MZLA Technologies.',
    'libreoffice': 'Complete open-source office productivity suite featuring Writer, Calc, Impress, Draw, Math, and Base.',
    'faststone': 'Lightweight Windows image viewer, batch photo converter, and lossless JPEG cropper with color management support.',
    'anyburn': 'Compact disc burning, ISO image extractor, and bootable USB creation utility for Windows 11 and 10.',
    'peazip': 'Cross-platform open-source archive manager supporting 200+ compression formats, two-factor encryption, and hashing.',
    'wireshark': 'Industry-standard open-source network protocol analyzer and live packet capture inspection suite.',
    'rustdesk': 'Open-source remote desktop application with end-to-end encryption and optional self-hosted relay servers.',
    'free download manager': 'Multi-connection download accelerator and BitTorrent client with bandwidth scheduling and resume support.',
    'kodi': 'Open-source home theater media center with hardware-accelerated decoding for local and network media libraries.',
    'shotcut': 'Cross-platform open-source video editor powered by FFmpeg and MLT with native 4K timeline editing.',
    'virtualbox': 'Open-source x86 and AMD64/Intel64 virtualization hypervisor for running Windows, Linux, and BSD virtual machines.',
    'filezilla': 'Cross-platform graphical FTP, FTPS, and SFTP client with site manager, transfer queues, and directory comparison.',
    'raspberry pi imager': 'Official Raspberry Pi OS flasher and SD card writer with pre-configured headless Wi-Fi and SSH setup.',
    'newpipe': 'Lightweight open-source Android media streaming frontend with background playback and offline downloads.',
    'seal': 'Open-source Android video and audio downloader powered by yt-dlp with Material Design 3 interface.'
  };
  var cards = document.querySelectorAll('.software-card');
  cards.forEach(function(card) {
    var cardImg = card.querySelector('.software-card-logo img, .post-card-thumb img');
    if (cardImg && cardImg.src && /\/s(16|32|48|64|72)(-c)?\//.test(cardImg.src)) {
      cardImg.src = cardImg.src.replace(/\/s(16|32|48|64|72)(-c)?\//, '/s320/');
    }
    var titleLink = card.querySelector('.app-title a');
    if (titleLink && titleLink.textContent) {
      titleLink.textContent = titleLink.textContent.replace(/\s*\(Free\)/gi, '').replace(/\s*\[Free\]/gi, '').replace(/^Download\s+/i, '').trim();
    }
    var snipEl = card.querySelector('.app-snippet');
    if (!snipEl) return;
    var titleEl = card.querySelector('.app-title');
    var titleLow = titleEl ? (titleEl.textContent || '').toLowerCase() : '';
    var matchedDesc = '';
    for (var k in cleanDescMap) {
      if (titleLow.indexOf(k) !== -1) {
        matchedDesc = cleanDescMap[k];
        break;
      }
    }
    if (matchedDesc) {
      snipEl.textContent = matchedDesc;
      return;
    }
    var txt = (snipEl.textContent || '').replace(/\s+/g, ' ').trim();
    txt = txt.replace(/^Author:.*?(?:System Utilities|Web Browsers|Multimedia\s*\x26\s*Video|Antivirus\s*\x26\s*Security|Utilities|Windows)\s*/i, '');
    txt = txt.replace(/\s*\(Free\)/gi, '').replace(/\s*\[Free\]/gi, '').replace(/the world's premier /gi, 'an ').replace(/the industry's premier /gi, 'an ');
    if (/^Author:|Published:|Last Updated:|Quick Technical Specifications/i.test(txt)) {
      txt = '';
    }
    if (!txt || !(txt.length >= 40)) {
      snipEl.textContent = 'Independent technical review, OS architecture compatibility matrix, SHA-256 checksum verification commands, and official developer download links.';
    } else {
      snipEl.textContent = txt;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement && !/^(INPUT|TEXTAREA|SELECT)$/i.test(document.activeElement.tagName)) {
      var sInput = document.getElementById('search-input');
      if (sInput) { e.preventDefault(); sInput.focus(); }
    } else if (e.key === 'Escape') {
      var dd = document.getElementById('live-search-dropdown');
      if (dd) dd.classList.remove('is-open');
    }
  });

  var searchInput = document.getElementById('search-input');
  var searchDropdown = document.getElementById('live-search-dropdown');
  var catalogIndex = null, catalogPromise = null, debounceTimer = null;

  function escHtml(s) {
    return String(s || '').replace(/\x26/g, '\x26amp;').replace(/\x3c/g, '\x26lt;').replace(/\x3e/g, '\x26gt;').replace(/\x22/g, '\x26quot;');
  }

  function getCatalog() {
    if (catalogIndex) return Promise.resolve(catalogIndex);
    if (catalogPromise) return catalogPromise;
    catalogPromise = fetch('/feeds/posts/summary?alt=json\x26max-results=100')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var entries = (d && d.feed && d.feed.entry) ? d.feed.entry : [];
        catalogIndex = entries.map(function(e) {
          var title = (e.title && e.title.$t) ? e.title.$t.replace(/\s*\(Free\)/gi, '').replace(/\s*\[Free\]/gi, '').trim() : '';
          var url = '';
          (e.link || []).forEach(function(l) { if (l.rel === 'alternate') url = l.href; });
          var badge = (e.category && e.category[0] && e.category[0].term) ? e.category[0].term : 'Software';
          return { title: title, tLow: title.toLowerCase(), url: url, badge: badge };
        }).filter(function(x) { return x.title && x.url; });
        return catalogIndex;
      }).catch(function() { return []; });
    return catalogPromise;
  }

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      var q = searchInput.value.trim().toLowerCase();
      if (!q) { searchDropdown.classList.remove('is-open'); return; }
      debounceTimer = setTimeout(function() {
        getCatalog().then(function(idx) {
          var hits = idx.filter(function(it) { return it.tLow.indexOf(q) !== -1; }).slice(0, 6);
          if (!hits.length) { searchDropdown.classList.remove('is-open'); return; }
          searchDropdown.innerHTML = hits.map(function(it) {
            return '\x3cli\x3e\x3ca href="' + it.url + '"\x3e' + escHtml(it.title) + '\x3c/a\x3e\x3cspan class="search-item-badges"\x3e\x3cspan class="search-badge-cat"\x3e' + escHtml(it.badge) + '\x3c/span\x3e\x3c/span\x3e\x3c/li\x3e';
          }).join('');
          searchDropdown.classList.add('is-open');
        });
      }, 120);
    });
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('is-open');
      }
    });
  }
})();
//]]>