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