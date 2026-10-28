# One Click Download India — Portal Assets (CSS & JS)

This repository contains the modular external stylesheets and client-side JavaScript utilities for the **One Click Download India** portal (https://www.google.com/search?q=https://oneclickdownloadindia.blogspot.com).

---

## 📁 Repository Directory Structure

```text
github_assets/
├── css/
│   ├── core-shell.css        # Global CSS variables, reset, header, navigation, layout grid, sidebar, footer
│   ├── homepage.css          # Compact hero strip, trust pills, featured 6-card releases dock
│   ├── listing.css           # Category hub banners, software cards grid, pagination controls
│   ├── post.css              # Article hero, quick specs grid, download box, tables, rating widget
│   ├── static-page.css       # Policy callouts, about desk layout, compliance typography
│   ├── error-404.css         # 404 error recovery container and top software recovery cards
│   └── bundle.css            # Consolidated all-in-one stylesheet (single HTTP request option)
├── js/
│   ├── main.js               # Dark/Light theme toggle, live autocomplete search, keyboard shortcuts (/ and Esc)
│   ├── post-tools.js         # 1-click SHA-256 hash copy button, URL share copy, Firebase star rating widget
│   └── redirects.js          # Legacy permalink redirect handler
└── README.md                 # Deployment and CDN integration guide
```

---

## 🚀 CDN Hosting Setup (How to Serve on Blogger)

Browsers enforce strict MIME-type checking (`nosniff`). If you try linking directly to GitHub raw files (`raw.githubusercontent.com`), browsers will block them because GitHub sends `Content-Type: text/plain`.

To serve CSS and JS on your live Blogger portal with correct `text/css` and `application/javascript` MIME headers, use **jsDelivr Anycast CDN** or **GitHub Pages**:

### Option 1: jsDelivr CDN (Recommended — Zero Configuration)
Format:
```text
https://cdn.jsdelivr.net/gh/<USERNAME>/<REPOSITORY>@<BRANCH_OR_TAG>/<PATH>
```

For example, with GitHub user `oneclickdownloadindia` and repository `portal-assets` on branch `main`:
- **Core CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/core-shell.css`
- **Homepage CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/homepage.css`
- **Listing CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/listing.css`
- **Post CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/post.css`
- **Static Page CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/static-page.css`
- **404 CSS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/css/error-404.css`
- **Main JS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/js/main.js`
- **Post Tools JS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/js/post-tools.js`
- **Redirects JS:** `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/js/redirects.js`

> Tip: You can append `.min.css` or `.min.js` to automatically serve on-the-fly minified builds via jsDelivr.

### Option 2: GitHub Pages
1. In your GitHub repository, navigate to **Settings** -> **Pages**.
2. Under **Build and deployment**, select `main` branch and `/ (root)`. Click **Save**.
3. Your assets will be served with correct MIME types at:
```text
https://<USERNAME>.github.io/<REPOSITORY>/css/core-shell.css
https://<USERNAME>.github.io/<REPOSITORY>/js/main.js
```

---

## 🛠️ GitHub Deployment Commands

To push these files to a new GitHub repository:

```bash
# 1. Initialize local repository
git init
git add .
git commit -m "Initial commit: Modular CSS and JS assets for One Click Download India"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# 3. Push to main branch
git branch -M main
git push -u origin main
```

---

## ⚙️ How to Update Blogger Theme XML

1. Open `software_blogger_theme.xml`.
2. Locate `https://cdn.jsdelivr.net/gh/oneclickdownloadindia/portal-assets@main/`.
3. If your GitHub username and repository name are different, replace `oneclickdownloadindia/portal-assets` with your exact `<YOUR_USERNAME>/<YOUR_REPOSITORY>`.
4. Copy the entire XML content, navigate to **Blogger Dashboard -> Theme -> Edit HTML**, paste it, and click **Save**.
