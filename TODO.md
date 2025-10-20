# TODO: Enhance Account Page with User Profile Details

## Steps to Complete
- [x] Import useSelector from react-redux in account.jsx
- [x] Update TabsList to include a third tab "Profile" (change grid-cols-2 to grid-cols-3)
- [x] Add TabsContent for "profile" displaying user details (userName, email, role) in a card layout
- [x] Ensure Orders and Address tabs remain unchanged
- [x] Test the account page to verify user details display correctly

## Notes
- User data is accessed via state.auth.user from Redux.
- Do not modify order history functionality.

---

# TODO: Improve CSS for All Pages to Look Like a Typical E-Commerce Website

## Steps to Complete
- [ ] Review key pages and components for styling improvements (e.g., home, listing, product-details, account, header, footer)
- [ ] Enhance header component for better navigation and branding
- [ ] Improve footer for cleaner layout and links
- [ ] Update account page profile tab styling for better visual appeal
- [ ] Adjust home page layout for more attractive product display
- [ ] Refine product listing and details pages for e-commerce feel
- [ ] Ensure all changes are cosmetic only, no functionality touched
- [ ] Test all pages for visual consistency and responsiveness

## Notes
- Focus on Tailwind CSS classes for clean, attractive design.
- Maintain existing functionality; only modify styles.
- Aim for modern e-commerce aesthetics: clean layouts, good spacing, attractive colors.

---

# TODO: Make Search Page More Decorative Like a Typical Wardrobe

## Steps to Complete
- [x] Add a fashion-themed background image to the search page
- [x] Style the search input with better colors, icons, and shadows
- [x] Add a decorative title or banner like "Explore Your Wardrobe"
- [x] Enhance the "No result found!" message with better styling
- [x] Ensure the grid layout remains responsive and attractive
- [x] Test the search page visually for wardrobe-like feel

## Notes
- Use Tailwind CSS for styling.
- Use existing assets like banner images for background.
- Keep functionality intact; only cosmetic changes.

---

# TODO: Add Bubble Effect to Cursor on Mouse Move

## Steps to Complete
- [x] Create a CursorBubbles component that tracks mouse movement
- [x] Generate bubble elements that emanate from the cursor position
- [x] Style bubbles with CSS animations for floating and fading effects
- [x] Add the component to App.jsx for global effect
- [x] Ensure bubbles are colorful and subtle, not obstructing content
- [x] Test the effect on various pages like search, home, etc.

## Notes
- Use React hooks for mouse tracking and state management.
- Implement with Tailwind CSS and custom CSS for animations.
- Make it performant to avoid lag.
