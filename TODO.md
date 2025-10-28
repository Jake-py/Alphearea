# TODO: Create Separate Mobile Version

## Split Codebase
- [ ] Create src/desktop/ and move all current src/ files there
- [ ] Create src/shared/ for common utilities (utils/, API calls, etc.)
- [ ] Create src/mobile/ for mobile-specific components

## Mobile Version
- [ ] Build simplified mobile interface with quick access to courses, dictionaries, chat
- [ ] Use big buttons, short lists, minimal navigation
- [ ] Add /mobile route in router

## Redirect
- [ ] Add user-agent detection in App.jsx to redirect mobile users to /mobile

## Testing and Deployment
- [ ] Test desktop and mobile versions
- [ ] Deploy to GitHub Pages
