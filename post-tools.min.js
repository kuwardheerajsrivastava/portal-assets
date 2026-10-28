/**
 * One Click Download India - Post Tools JavaScript
 * SHA-256 Copy Helper, Link Share Copy & Firebase Community Star Ratings
 */
(function() {
  window.copyPostLink = function(btn) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(window.location.href).then(function() {
      var textSpan = btn.querySelector('.copy-btn-text');
      if (textSpan) {
        var orig = textSpan.textContent;
        textSpan.textContent = 'Copied!';
        setTimeout(function() { textSpan.textContent = orig; }, 2000);
      }
    });
  };

  window.copyChecksum = function(hashVal, btn) {
    if (!hashVal || !navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(hashVal.trim()).then(function() {
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function() { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    var oldBylines = document.querySelectorAll('.editorial-byline');
    oldBylines.forEach(function(b) { if (b && b.parentNode) b.parentNode.removeChild(b); });
    var tableCells = document.querySelectorAll('.software-description td, .entry-content td');
    tableCells.forEach(function(td) {
      var match = td.textContent.trim().match(/([a-fA-F0-9]{64})/);
      if (match && !td.querySelector('.btn-copy-inline')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-copy-inline';
        btn.title = 'Copy SHA-256 Hash';
        btn.textContent = 'Copy';
        btn.onclick = function() { window.copyChecksum(match[1], btn); };
        td.appendChild(btn);
      }
    });
  });

  /* Dynamic Multi-OS Platform Switcher for #download-box (FileHippo & SourceForge Inspired) */
  var dlBox = document.getElementById('download-box');
  if (dlBox) {
    var btnsContainer = dlBox.querySelector('.download-buttons');
    if (btnsContainer) {
      var dlLinks = Array.prototype.slice.call(btnsContainer.querySelectorAll('a.btn-dl'));
      if (dlLinks.length > 2) {
        var platforms = {
          'windows': { label: 'Windows', count: 0 },
          'mac': { label: 'macOS', count: 0 },
          'linux': { label: 'Linux', count: 0 },
          'android': { label: 'Android', count: 0 }
        };

        dlLinks.forEach(function(link) {
          var t = (link.textContent || '').toLowerCase();
          var href = (link.href || '').toLowerCase();
          var matched = false;
          if (t.indexOf('win') !== -1 || t.indexOf('.exe') !== -1 || t.indexOf('.msi') !== -1 || href.indexOf('.exe') !== -1 || href.indexOf('.msi') !== -1) {
            link.setAttribute('data-os', 'windows');
            platforms.windows.count++;
            matched = true;
          }
          if (t.indexOf('mac') !== -1 || t.indexOf('dmg') !== -1 || href.indexOf('.dmg') !== -1 || t.indexOf('apple silicon') !== -1) {
            link.setAttribute('data-os', 'mac');
            platforms.mac.count++;
            matched = true;
          }
          if (t.indexOf('linux') !== -1 || t.indexOf('appimage') !== -1 || t.indexOf('.deb') !== -1 || t.indexOf('.rpm') !== -1 || t.indexOf('.tar') !== -1) {
            link.setAttribute('data-os', 'linux');
            platforms.linux.count++;
            matched = true;
          }
          if (t.indexOf('android') !== -1 || t.indexOf('apk') !== -1 || href.indexOf('.apk') !== -1) {
            link.setAttribute('data-os', 'android');
            platforms.android.count++;
            matched = true;
          }
          if (!matched) {
            link.setAttribute('data-os', 'other');
          }
        });

        var activePlatforms = Object.keys(platforms).filter(function(k) { return platforms[k].count > 0; });
        if (activePlatforms.length > 1) {
          var tabsWrap = document.createElement('div');
          tabsWrap.className = 'dl-platform-tabs';

          var allTab = document.createElement('button');
          allTab.type = 'button';
          allTab.className = 'dl-platform-tab is-active';
          allTab.textContent = 'All Downloads (' + dlLinks.length + ')';
          tabsWrap.appendChild(allTab);

          var tabBtns = [allTab];

          activePlatforms.forEach(function(k) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dl-platform-tab';
            btn.textContent = platforms[k].label + ' (' + platforms[k].count + ')';
            btn.setAttribute('data-filter', k);
            tabsWrap.appendChild(btn);
            tabBtns.push(btn);
          });

          tabsWrap.addEventListener('click', function(e) {
            var target = e.target;
            if (!target || !target.classList.contains('dl-platform-tab')) return;
            tabBtns.forEach(function(b) { b.classList.remove('is-active'); });
            target.classList.add('is-active');
            var filter = target.getAttribute('data-filter');
            dlLinks.forEach(function(link) {
              if (!filter) {
                link.style.display = '';
              } else {
                var os = link.getAttribute('data-os');
                link.style.display = (os === filter) ? '' : 'none';
              }
            });
          });

          btnsContainer.parentNode.insertBefore(tabsWrap, btnsContainer);
        }
      }
    }
  }

  /* Terminal Verification Command 1-Click Copy Helper (SourceForge & LO4D Inspired) */
  var preBlocks = document.querySelectorAll('pre');
  preBlocks.forEach(function(pre) {
    var txt = pre.textContent || '';
    if (txt.indexOf('Get-FileHash') !== -1 || txt.indexOf('certutil') !== -1 || txt.indexOf('shasum') !== -1 || txt.indexOf('sha256sum') !== -1) {
      if (pre.parentNode && !pre.parentNode.classList.contains('terminal-code-wrap')) {
        var wrap = document.createElement('div');
        wrap.className = 'terminal-code-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'terminal-copy-btn';
        copyBtn.textContent = 'Copy Command';
        copyBtn.onclick = function() {
          if (!navigator.clipboard || !navigator.clipboard.writeText) return;
          navigator.clipboard.writeText(txt.trim()).then(function() {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function() {
              copyBtn.textContent = 'Copy Command';
              copyBtn.classList.remove('copied');
            }, 2000);
          });
        };
        wrap.appendChild(copyBtn);
      }
    }
  });


  var FIREBASE_URL = 'https://oneclickdownload-ratings-default-rtdb.asia-southeast1.firebasedatabase.app';
  var starPicker = document.getElementById('ocd-star-picker');
  var statsEl = document.getElementById('ocd-rating-stats');
  var feedbackEl = document.getElementById('ocd-rating-feedback');
  if (!starPicker || !statsEl) return;

  function getPostSlug() {
    var path = window.location.pathname || '';
    var parts = path.split('/').filter(Boolean);
    var file = parts.length ? parts[parts.length - 1] : 'home';
    return file.replace(/\.html$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_') || 'default_software';
  }

  var slug = getPostSlug();
  var storageKey = 'ocd_rating_' + slug;
  var userVote = null;
  try { userVote = localStorage.getItem(storageKey); } catch(e) {}
  var stars = Array.prototype.slice.call(starPicker.querySelectorAll('.ocd-star'));
  var currentRatingData = { count: 0, sum: 0, average: 0 };

  function highlightStars(val) {
    stars.forEach(function(s) {
      var sVal = parseInt(s.getAttribute('data-value'), 10);
      if (!(sVal > val)) s.classList.add('active');
      else s.classList.remove('active');
    });
  }

  function renderDisplay(data, votedVal) {
    if (votedVal) {
      starPicker.classList.add('voted');
      highlightStars(parseInt(votedVal, 10));
      if (feedbackEl) {
        feedbackEl.className = 'ocd-rating-feedback ocd-feedback-info is-visible';
        feedbackEl.textContent = 'You rated this software ' + votedVal + ' star' + (votedVal > 1 ? 's' : '') + '.';
      }
    }
    var count = data && data.count ? parseInt(data.count, 10) : 0;
    var avg = data && data.average ? parseFloat(data.average).toFixed(1) : 0;
    if (count > 0) {
      statsEl.innerHTML = '\x3cspan class="ocd-score"\x3e\u2605 ' + avg + ' / 5.0\x3c/span\x3e\x3cspan class="ocd-count"\x3e(' + count + ' user review' + (count > 1 ? 's' : '') + ')\x3c/span\x3e';
    } else {
      statsEl.innerHTML = '\x3cspan class="ocd-count"\x3eNo ratings yet. Be the first to rate this release!\x3c/span\x3e';
    }
  }

  var endpoint = FIREBASE_URL + '/ratings/' + encodeURIComponent(slug) + '.json';
  fetch(endpoint)
    .then(function(res) { return res.ok ? res.json() : null; })
    .then(function(val) {
      if (val && typeof val === 'object') {
        currentRatingData = {
          count: val.count || 0,
          sum: val.sum || 0,
          average: val.average || (val.count ? (val.sum / val.count).toFixed(1) : 0)
        };
      }
      renderDisplay(currentRatingData, userVote);
    })
    .catch(function() { renderDisplay(currentRatingData, userVote); });

  stars.forEach(function(star) {
    star.addEventListener('click', function() {
      if (starPicker.classList.contains('voted')) return;
      var starVal = parseInt(this.getAttribute('data-value'), 10);
      if (!starVal || !(starVal >= 1) || starVal > 5) return;
      try { localStorage.setItem(storageKey, starVal); } catch(e) {}
      userVote = starVal;
      starPicker.classList.add('voted');
      highlightStars(starVal);
      if (feedbackEl) {
        feedbackEl.className = 'ocd-rating-feedback ocd-feedback-info is-visible';
        feedbackEl.textContent = 'Submitting your ' + starVal + '-star rating...';
      }
      fetch(endpoint)
        .then(function(res) { return res.ok ? res.json() : null; })
        .catch(function() { return null; })
        .then(function(existing) {
          var prevCount = (existing && existing.count) ? parseInt(existing.count, 10) : (currentRatingData.count || 0);
          var prevSum = (existing && existing.sum) ? parseFloat(existing.sum) : (currentRatingData.sum || 0);
          var newCount = prevCount + 1;
          var newSum = prevSum + starVal;
          var newAvg = Math.round((newSum / newCount) * 10) / 10;
          var payload = { count: newCount, sum: newSum, average: newAvg, lastUpdated: new Date().toISOString() };
          return fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(function(putRes) {
            if (!putRes.ok) throw new Error('PUT failed');
            return payload;
          });
        })
        .then(function(saved) {
          currentRatingData = saved;
          renderDisplay(saved, starVal);
          if (feedbackEl) {
            feedbackEl.className = 'ocd-rating-feedback ocd-feedback-success is-visible';
            feedbackEl.textContent = 'Thank you! Your ' + starVal + '-star rating has been recorded.';
          }
        })
        .catch(function() {
          var fallbackCount = (currentRatingData.count || 0) + 1;
          var fallbackSum = (currentRatingData.sum || 0) + starVal;
          var fallbackAvg = Math.round((fallbackSum / fallbackCount) * 10) / 10;
          currentRatingData = { count: fallbackCount, sum: fallbackSum, average: fallbackAvg };
          renderDisplay(currentRatingData, starVal);
          if (feedbackEl) {
            feedbackEl.className = 'ocd-rating-feedback ocd-feedback-success is-visible';
            feedbackEl.textContent = 'Your ' + starVal + '-star rating was saved locally.';
          }
        });
    });
  });
})();
//]]>