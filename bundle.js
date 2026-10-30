/**
 * One Click Download India - Production JavaScript Bundle (v2.5)
 * Theme Switcher, Table Auto-Repair, Search, Download Toast, Checksum Copy, Firebase Ratings
 */

/* ==========================================
   1. CORE PORTAL & UTILITY ENGINE
   ========================================== */
(function() {
// Dark Mode Toggle
var themeToggleBtn = document.getElementById('theme-toggle-btn');
var themeIcon = document.getElementById('theme-icon');
var currentTheme = localStorage.getItem('portal_theme') || 'light';
function applyTheme(theme) {
if (theme === 'dark') {
document.documentElement.setAttribute('data-theme', 'dark');
if (themeIcon) themeIcon.textContent = '☀️';
} else {
document.documentElement.removeAttribute('data-theme');
if (themeIcon) themeIcon.textContent = '🌙';
}
}
applyTheme(currentTheme);
if (themeToggleBtn) {
themeToggleBtn.addEventListener('click', function() {
var active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
localStorage.setItem('portal_theme', active);
applyTheme(active);
});
}
// Auto-repair malformed post tables where download boxes or blocks were nested inside cells
try {
var postTables = document.querySelectorAll('.software-description table');
postTables.forEach(function(tbl) {
var misplaced = tbl.querySelectorAll('#download-box, [id*="download"], .download-box, .user-reviews, .comments');
misplaced.forEach(function(el) {
if (tbl.parentNode) {
tbl.parentNode.insertBefore(el, tbl.nextSibling);
}
});
});
} catch(err) {
console.warn('Table auto-repair check:', err);
}
// Dynamic Random Related Software Engine with Smart Deduplication
var relatedGrid = document.getElementById('related-software-grid');
if (relatedGrid) {
function getSoftwareRoot(titleStr) {
if (!titleStr) return '';
var clean = titleStr.toLowerCase()
.replace(/^download\s+/i, '')
.replace(/\s+(for\s+windows|download|free|apk|portable|full|review).*$/i, '')
.replace(/\s+[0-9]+(\.[0-9]+)+.*$/, '')
.trim();
var words = clean.split(/\s+/);
return (words[0] || '').replace(/[^a-z0-9]/g, '');
}
var currentTitleEl = document.querySelector('.software-detail-title');
var currentRoot = currentTitleEl ? getSoftwareRoot(currentTitleEl.textContent) : '';
fetch('/feeds/posts/summary?alt=json&max-results=50')
.then(function(res) { return res.json(); })
.then(function(data) {
var entries = (data.feed && data.feed.entry) ? data.feed.entry : [];
if (entries.length === 0) {
var sec = document.getElementById('related-software-section');
if (sec) sec.style.display = 'none';
return;
}
var currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
// Get current post labels from meta
var currentLabels = [];
var labelPills = document.querySelectorAll('.software-subtitle-meta .pill-os');
labelPills.forEach(function(pill) {
var txt = pill.textContent.trim().toLowerCase();
if (txt) currentLabels.push(txt);
});
var matchingCategory = [];
var otherCandidates = [];
for (var i = 0; i < entries.length; i++) {
var entry = entries[i];
var postUrl = '';
for (var j = 0; j < entry.link.length; j++) {
if (entry.link[j].rel === 'alternate') {
postUrl = entry.link[j].href;
break;
}
}
if (!postUrl) continue;
var a = document.createElement('a');
a.href = postUrl;
var postPath = a.pathname.toLowerCase().replace(/\/$/, '');
if (postPath && postPath === currentPath) {
continue; // Skip current post URL
}
var itemObj = { entry: entry, url: postUrl };
// Check if matches any current label
var isMatch = false;
if (entry.category && entry.category.length > 0 && currentLabels.length > 0) {
for (var c = 0; c < entry.category.length; c++) {
var term = (entry.category[c].term || '').toLowerCase();
if (currentLabels.indexOf(term) !== -1) {
isMatch = true;
break;
}
}
}
if (isMatch) {
matchingCategory.push(itemObj);
} else {
otherCandidates.push(itemObj);
}
}
// Randomize arrays using Fisher-Yates shuffle
function shuffle(arr) {
for (var k = arr.length - 1; k > 0; k--) {
var r = Math.floor(Math.random() * (k + 1));
var temp = arr[k];
arr[k] = arr[r];
arr[r] = temp;
}
return arr;
}
shuffle(matchingCategory);
shuffle(otherCandidates);
// Combine with priority to matching category, followed by general catalog
var combined = matchingCategory.concat(otherCandidates);
// Deduplicate by software root name (prevents duplicate VLC, 7-Zip, etc.)
var seenRoots = {};
if (currentRoot) {
seenRoots[currentRoot] = true; // Never recommend the current software
}
var selected = [];
for (var s = 0; s < combined.length; s++) {
var eTitle = combined[s].entry.title;
var candidateTitle = (eTitle && eTitle.$t) ? eTitle.$t : ((typeof eTitle === 'string') ? eTitle : '');
var candRoot = getSoftwareRoot(candidateTitle);
if (candRoot && seenRoots[candRoot]) {
continue; // Skip duplicate software!
}
if (candRoot) {
seenRoots[candRoot] = true;
}
selected.push(combined[s]);
if (selected.length >= 3) break;
}
if (selected.length === 0) {
var sec = document.getElementById('related-software-section');
if (sec) sec.style.display = 'none';
return;
}
relatedGrid.innerHTML = '';
selected.forEach(function(item) {
var e = item.entry;
var title = (e.title && e.title.$t) ? e.title.$t : ((typeof e.title === 'string') ? e.title : 'Software Application');
// Ensure Free is in brackets in related card titles
title = title.replace(/\((Free)\)/gi, '___F1___')
.replace(/\[(Free)\]/gi, '___F2___')
.replace(/\bFree\b/gi, '(Free)')
.replace(/___F1___/g, '(Free)')
.replace(/___F2___/g, '[Free]');
var url = item.url;
// Category tag
var categoryTag = 'Software';
if (e.category && e.category.length > 0) {
for (var c = 0; c < e.category.length; c++) {
var term = e.category[c].term;
if (term) {
categoryTag = term;
break;
}
}
}
// Summary snippet
var snippet = '';
if (e.summary && e.summary.$t) {
var cleanText = e.summary.$t.replace(/<[^>]*>/g, '').trim();
if (cleanText.length > 70) {
cleanText = cleanText.substring(0, 70).trim() + '...';
}
snippet = cleanText;
}
var card = document.createElement('div');
card.className = 'related-card';
card.innerHTML =
'<div class="related-card-top">' +
'<div class="related-card-info">' +
'<h4 class="related-card-title"><a href="' + url + '">' + title + '</a></h4>' +
'<div class="related-card-tags">' +
'<span class="pill-os">' + categoryTag + '</span>' +
'<span class="pill-license">(Free)</span>' +
'</div>' +
'</div>' +
'</div>' +
(snippet ? '<p class="related-card-snippet">' + snippet + '</p>' : '') +
'<div class="related-card-action">' +
'<a class="related-card-btn" href="' + url + '"><span>View &amp; Download</span> ⬇</a>' +
'</div>';
relatedGrid.appendChild(card);
});
})
.catch(function(err) {
console.error('Related software load error:', err);
var sec = document.getElementById('related-software-section');
if (sec) sec.style.display = 'none';
});
}
// Social Sharing Copy Link Helper
window.copyPostLink = function(btn) {
var url = window.location.href;
function showFeedback() {
var textSpan = btn.querySelector('.copy-btn-text');
if (textSpan) {
var orig = textSpan.textContent;
textSpan.textContent = 'Copied! ✓';
btn.style.background = '#10b981';
btn.style.color = '#ffffff';
btn.style.borderColor = '#10b981';
setTimeout(function() {
textSpan.textContent = orig;
btn.style.background = '';
btn.style.color = '';
btn.style.borderColor = '';
}, 2000);
}
}
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(url).then(showFeedback).catch(function() {
fallbackCopyText(url, showFeedback);
});
} else {
fallbackCopyText(url, showFeedback);
}
};
function fallbackCopyText(text, cb) {
var ta = document.createElement('textarea');
ta.value = text;
ta.style.position = 'fixed';
ta.style.left = '-9999px';
document.body.appendChild(ta);
ta.focus();
ta.select();
try {
document.execCommand('copy');
if (cb) cb();
} catch(err) {}
document.body.removeChild(ta);
}
// Global Report Broken Link & Outdated Version Handlers
window.reportBrokenLink = function() {
var pageTitle = encodeURIComponent(document.title);
var pageUrl = encodeURIComponent(window.location.href);
var email = 'oneclickdownloadindia@gmail.com';
var subject = 'Broken Download Link: ' + pageTitle;
var body = 'Hi One Click Download India,%0D%0A%0D%0AThe download link on this page is not working:%0D%0A' + pageUrl + '%0D%0A%0D%0APlease update the download mirror.';
window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
};
window.reportOutdatedVersion = function() {
var pageTitle = encodeURIComponent(document.title);
var pageUrl = encodeURIComponent(window.location.href);
var email = 'oneclickdownloadindia@gmail.com';
var subject = 'New Version Update: ' + pageTitle;
var body = 'Hi One Click Download India,%0D%0A%0D%0AThere is a newer version available for this software:%0D%0A' + pageUrl + '%0D%0A%0D%0ANew Version (if known): %0D%0AOfficial Release URL (optional): %0D%0A%0D%0AThank you!';
window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
};
// Instant Predictive Live Search
var searchInput = document.getElementById('search-input');
var searchDropdown = document.getElementById('live-search-dropdown');
var debounceTimer = null;
if (searchInput && searchDropdown) {
searchInput.addEventListener('input', function() {
clearTimeout(debounceTimer);
var q = searchInput.value.trim();
if (q.length < 2) {
searchDropdown.innerHTML = '';
searchDropdown.style.display = 'none';
return;
}
debounceTimer = setTimeout(function() {
fetch('/feeds/posts/summary?alt=json&q=' + encodeURIComponent(q) + '&max-results=6')
.then(function(res) { return res.json(); })
.then(function(data) {
searchDropdown.innerHTML = '';
var entries = (data.feed && data.feed.entry) ? data.feed.entry : [];
if (entries.length === 0) {
searchDropdown.innerHTML = '<li style="color:var(--text-muted);">No software found for &quot;' + q + '&quot;</li>';
searchDropdown.style.display = 'block';
return;
}
entries.forEach(function(entry) {
var title = entry.title.$t;
var url = '';
for (var i = 0; i < entry.link.length; i++) {
if (entry.link[i].rel === 'alternate') {
url = entry.link[i].href;
break;
}
}
var li = document.createElement('li');
li.innerHTML = '<a href="' + url + '">' + title + '</a><span style="font-size:0.75rem; color:var(--download-green); font-weight:700;">FREE</span>';
searchDropdown.appendChild(li);
});
searchDropdown.style.display = 'block';
})
.catch(function() {
searchDropdown.style.display = 'none';
});
}, 220);
});
document.addEventListener('click', function(e) {
if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
searchDropdown.style.display = 'none';
}
});
}
})();
// Checksum Copy to Clipboard Handler
window.copyChecksum = function(hashOrBtn, optionalHash) {
var textToCopy = '';
var targetBtn = null;
if (typeof hashOrBtn === 'string') {
textToCopy = hashOrBtn;
if (optionalHash && optionalHash.tagName) targetBtn = optionalHash;
} else if (hashOrBtn && hashOrBtn.getAttribute) {
targetBtn = hashOrBtn;
textToCopy = hashOrBtn.getAttribute('data-hash') || hashOrBtn.textContent || '';
}
if (!textToCopy && targetBtn) {
var parentWidget = targetBtn.closest('.checksum-widget');
if (parentWidget) {
var codeEl = parentWidget.querySelector('.checksum-code');
if (codeEl) textToCopy = codeEl.textContent.trim();
}
}
textToCopy = textToCopy.replace(/^(SHA-256|MD5|SHA-1):\s*/i, '').trim();
if (!textToCopy) return;
function setCopiedState() {
if (targetBtn) {
var origText = targetBtn.innerHTML;
targetBtn.innerHTML = '✓ Copied!';
targetBtn.classList.add('copied');
setTimeout(function() {
targetBtn.innerHTML = origText;
targetBtn.classList.remove('copied');
}, 2000);
}
}
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(textToCopy).then(setCopiedState).catch(function() {
fallbackCopy(textToCopy, setCopiedState);
});
} else {
fallbackCopy(textToCopy, setCopiedState);
}
};
function fallbackCopy(text, cb) {
var ta = document.createElement('textarea');
ta.value = text;
ta.style.position = 'fixed';
ta.style.opacity = '0';
document.body.appendChild(ta);
ta.select();
try {
document.execCommand('copy');
if (cb) cb();
} catch(e) {}
document.body.removeChild(ta);
}
// Auto-enhance SHA-256 table cells with 1-click copy buttons
document.addEventListener('DOMContentLoaded', function() {
var tableCells = document.querySelectorAll('.software-description td, .entry-content td');
tableCells.forEach(function(td) {
var txt = td.textContent.trim();
// 64-character hex hash pattern (SHA-256)
var match = txt.match(/([a-fA-F0-9]{64})/);
if (match && !td.querySelector('.btn-copy-inline')) {
var hashVal = match[1];
var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'btn-copy-inline';
btn.title = 'Copy SHA-256 Hash to Clipboard';
btn.innerHTML = '📋 Copy';
btn.onclick = function() {
window.copyChecksum(hashVal, btn);
};
td.appendChild(btn);
}
});
});
// Download Toast Notification Controller
var toastTimer = null;
window.showDownloadToast = function() {
var toast = document.getElementById('download-toast');
if (!toast) return;
toast.classList.add('show');
clearTimeout(toastTimer);
toastTimer = setTimeout(function() {
window.closeDownloadToast();
}, 8000);
};
window.closeDownloadToast = function() {
var toast = document.getElementById('download-toast');
if (toast) toast.classList.remove('show');
};
// Global click delegation for all download buttons
document.addEventListener('click', function(e) {
var target = e.target.closest('a');
if (!target) return;
var href = target.getAttribute('href') || '';
// Ignore anchor-only or non-actionable links
if (!href || href === '#' || href === '#download-box' || href.indexOf('javascript:') === 0) return;
// Never trigger toast on secondary informational text links (e.g. portal/GitHub webpage links)
// Only trigger on primary action buttons or direct binary executable downloads
var isDownloadBtn = target.classList.contains('btn-dl') ||
target.classList.contains('primary-download-btn') ||
target.hasAttribute('download') ||
href.indexOf('export=download') !== -1 ||
/\.(exe|apk|zip|msi|dmg|iso|7z|rar)($|\?|\/)/i.test(href);
if (isDownloadBtn) {
window.showDownloadToast();
try {
if (typeof gtag === 'function') {
gtag('event', 'software_download', {
'event_category': 'Software Download',
'event_label': (target.textContent || '').trim().substring(0, 100),
'download_url': href,
'page_location': window.location.href,
'page_title': document.title
});
}
} catch(err) {
console.warn('GA4 event error:', err);
}
}
});
// 404 Error Search Handler
window.triggerErrorSearch = function() {
var input = document.getElementById('error-search-input');
if (input && input.value.trim()) {
window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
}
};
var errInput = document.getElementById('error-search-input');
if (errInput) {
errInput.addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
window.triggerErrorSearch();
}
});
}
// Auto-bracket 'Free' in titles across post headers, homepage cards, and related downloads
try {
var titleElements = document.querySelectorAll('.software-detail-title, .app-title a, .related-card-title a');
titleElements.forEach(function(el) {
if (el.textContent && /\bFree\b/i.test(el.textContent) && !/\([Free]\)/i.test(el.textContent)) {
el.textContent = el.textContent.replace(/\((Free)\)/gi, '___F1___')
.replace(/\[(Free)\]/gi, '___F2___')
.replace(/\bFree\b/gi, '(Free)')
.replace(/___F1___/g, '(Free)')
.replace(/___F2___/g, '[Free]');
}
});
} catch(err) {
console.warn('Title bracket cleanup check:', err);
}

/* ==========================================
   2. FIREBASE REALTIME COMMUNITY RATINGS
   ========================================== */
(function() {
var FIREBASE_URL = 'https://oneclickdownload-ratings-default-rtdb.asia-southeast1.firebasedatabase.app';
var starPicker = document.getElementById('ocd-star-picker');
var statsEl = document.getElementById('ocd-rating-stats');
var feedbackEl = document.getElementById('ocd-rating-feedback');
if (!starPicker || !statsEl) return;
function getPostSlug() {
var path = window.location.pathname || '';
var parts = path.split('/').filter(Boolean);
var file = parts.length > 0 ? parts[parts.length - 1] : 'home';
var clean = file.replace(/\.html$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
return clean || 'default_software';
}
var slug = getPostSlug();
var storageKey = 'ocd_rating_' + slug;
var userVote = null;
try {
userVote = localStorage.getItem(storageKey);
} catch(e) {}
var stars = Array.prototype.slice.call(starPicker.querySelectorAll('.ocd-star'));
var currentRatingData = { count: 0, sum: 0, average: 0 };
function highlightStars(val) {
stars.forEach(function(s) {
var sVal = parseInt(s.getAttribute('data-value'), 10);
if (sVal <= val) {
s.classList.add('active');
} else {
s.classList.remove('active');
}
});
}
function renderDisplay(data, votedVal) {
if (votedVal) {
starPicker.classList.add('voted');
highlightStars(parseInt(votedVal, 10));
if (feedbackEl) {
feedbackEl.className = 'ocd-rating-feedback ocd-feedback-info';
feedbackEl.textContent = '✓ You rated this software ' + votedVal + ' star' + (votedVal > 1 ? 's' : '') + '.';
feedbackEl.style.display = 'inline-block';
}
}
var count = data && data.count ? parseInt(data.count, 10) : 0;
var avg = data && data.average ? parseFloat(data.average).toFixed(1) : 0;
if (count > 0) {
statsEl.innerHTML = '<span class="ocd-score">★ ' + avg + ' / 5.0</span><span class="ocd-count">(' + count + ' verified user review' + (count > 1 ? 's' : '') + ')</span>';
} else {
statsEl.innerHTML = '<span class="ocd-count">No ratings yet. Be the first to share your experience!</span>';
}
// Dynamically inject AggregateRating into Schema.org JSON-LD if count >= 3
if (count >= 3 && avg > 0) {
syncSchemaRating(avg, count);
}
}
function syncSchemaRating(avg, count) {
try {
var scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
scriptTags.forEach(function(st) {
try {
var parsed = JSON.parse(st.textContent);
var updated = false;
if (parsed && parsed['@graph'] && Array.isArray(parsed['@graph'])) {
parsed['@graph'].forEach(function(node) {
if (node['@type'] === 'SoftwareApplication') {
node.aggregateRating = {
'@type': 'AggregateRating',
'ratingValue': String(avg),
'ratingCount': String(count),
'bestRating': '5',
'worstRating': '1'
};
updated = true;
}
});
} else if (parsed && parsed['@type'] === 'SoftwareApplication') {
parsed.aggregateRating = {
'@type': 'AggregateRating',
'ratingValue': String(avg),
'ratingCount': String(count),
'bestRating': '5',
'worstRating': '1'
};
updated = true;
}
if (updated) {
st.textContent = JSON.stringify(parsed);
}
} catch(err) {}
});
} catch(e) {}
}
// Fetch initial ratings from Firebase RTDB REST API
var endpoint = FIREBASE_URL + '/ratings/' + encodeURIComponent(slug) + '.json';
fetch(endpoint)
.then(function(res) {
if (!res.ok) throw new Error('HTTP ' + res.status);
return res.json();
})
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
.catch(function(err) {
console.warn('Rating fetch warning:', err);
renderDisplay(currentRatingData, userVote);
});
// Star Click Event Handling
stars.forEach(function(star) {
star.addEventListener('click', function() {
if (starPicker.classList.contains('voted')) return;
var starVal = parseInt(this.getAttribute('data-value'), 10);
if (!starVal || starVal < 1 || starVal > 5) return;
// Immediate client lock & optimistic feedback
try {
localStorage.setItem(storageKey, starVal);
} catch(e) {}
userVote = starVal;
starPicker.classList.add('voted');
highlightStars(starVal);
if (feedbackEl) {
feedbackEl.className = 'ocd-rating-feedback ocd-feedback-info';
feedbackEl.textContent = 'Submitting your ' + starVal + '-star rating...';
feedbackEl.style.display = 'inline-block';
}
// Fetch fresh state to prevent race conditions, then PUT update
fetch(endpoint)
.then(function(res) {
return res.ok ? res.json() : null;
})
.catch(function() { return null; })
.then(function(existing) {
var prevCount = (existing && existing.count) ? parseInt(existing.count, 10) : (currentRatingData.count || 0);
var prevSum = (existing && existing.sum) ? parseFloat(existing.sum) : (currentRatingData.sum || 0);
var newCount = prevCount + 1;
var newSum = prevSum + starVal;
var newAvg = Math.round((newSum / newCount) * 10) / 10;
var payload = {
count: newCount,
sum: newSum,
average: newAvg,
lastUpdated: new Date().toISOString()
};
return fetch(endpoint, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
}).then(function(putRes) {
if (!putRes.ok) throw new Error('PUT failed: ' + putRes.status);
return payload;
});
})
.then(function(saved) {
currentRatingData = saved;
renderDisplay(saved, starVal);
if (feedbackEl) {
feedbackEl.className = 'ocd-rating-feedback ocd-feedback-success';
feedbackEl.textContent = '✓ Thank you! Your ' + starVal + '-star rating has been successfully recorded.';
feedbackEl.style.display = 'inline-block';
}
})
.catch(function(saveErr) {
console.error('Failed to save rating:', saveErr);
// Fallback display with local increment
var fallbackCount = (currentRatingData.count || 0) + 1;
var fallbackSum = (currentRatingData.sum || 0) + starVal;
var fallbackAvg = Math.round((fallbackSum / fallbackCount) * 10) / 10;
currentRatingData = { count: fallbackCount, sum: fallbackSum, average: fallbackAvg };
renderDisplay(currentRatingData, starVal);
if (feedbackEl) {
feedbackEl.className = 'ocd-rating-feedback ocd-feedback-success';
feedbackEl.textContent = '✓ Your ' + starVal + '-star rating was saved locally. Thank you!';
feedbackEl.style.display = 'inline-block';
}
});
});
});
})();
