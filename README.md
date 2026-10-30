# One Click Download India — Production Web Assets

This repository hosts the official modular CSS stylesheets and JavaScript client-side libraries for [One Click Download India](https://oneclickdownloadindia.blogspot.com).

## Directory Structure
```
portal-assets/
├── css/
│   ├── bundle.css          # All-in-one unified stylesheet (Core + Home + Post + Search)
│   ├── core-shell.css      # Base responsive framework, header, footer, search, ratings
│   ├── homepage.css        # Homepage hero banner and software card grid
│   ├── post.css            # Software detail page, specs grid, download box, tables
│   └── listing.css         # Category/search results and pagination controls
├── js/
│   ├── bundle.js           # All-in-one unified JavaScript engine
│   ├── main.js             # Dark/Light mode, live search, table repair, download toast
│   └── ratings.js          # Firebase Realtime Database 5-star community ratings
└── README.md
```

## How to Deploy to GitHub & Deliver via jsDelivr CDN

1. **Create Repository:** Create a public GitHub repository named `portal-assets` (or push to your existing repository).
2. **Push Files:** Upload the `css/` and `js/` folders to your `main` branch.
3. **jsDelivr CDN Endpoints:** jsDelivr automatically caches and serves GitHub files worldwide across global Anycast edge networks with instant HTTP/2 and Brotli compression.

### Recommended All-in-One Tags (Simplest & Fastest):
```html
<!-- Inside Blogger <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/css/bundle.css" />

<!-- Before closing </body> -->
<script src="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/js/bundle.js" defer></script>
```

### Modular Tags (Page-Specific Performance Optimization):
```html
<!-- Core Shell (Loaded everywhere) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/css/core-shell.css" />

<!-- Conditional Page Stylesheets -->
<b:if cond='data:view.isHomepage'>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/css/homepage.css" />
<b:elseif cond='data:view.isPost or data:view.isPage'/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/css/post.css" />
<b:elseif cond='data:view.isArchive or data:view.isSearch'/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/css/listing.css" />
</b:if>

<!-- Modular Scripts -->
<script src="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/js/main.js" defer></script>
<b:if cond='data:view.isPost'>
  <script src="https://cdn.jsdelivr.net/gh/<USERNAME>/portal-assets@main/js/ratings.js" defer></script>
</b:if>
```
*(Replace `<USERNAME>` with your GitHub username).*
