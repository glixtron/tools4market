# Suggest Feature

The Suggest feature provides **AI-powered** automated recommendations for website improvements based on audit findings. It analyzes site content and suggests actionable enhancements to boost SEO, user experience, and crawlability.

## How It Works

The suggest API (powered by AI) examines a website and returns prioritized recommendations for:
- Title and description length optimization
- HTTP status code improvements
- Meta tag completeness (Open Graph, Twitter, JSON-LD)
- Viewport and responsive design checks
- Canonical tag presence and consistency
- Image alt text and dimensions
- Keyword density and content quality

## Available Recommendations

- **Title Presence**: Ensure page titles are present and descriptive
- **Description Length**: Check that meta descriptions are appropriately sized (120–155 characters)
- **HTTP Status**: Fix 4xx/5xx errors and ensure proper status codes
- **Title Presence**: Verify title tags are present
- **HTML Language**: Confirm HTML lang attribute is set
- **Viewport**: Ensure responsive design with proper viewport meta tag
- **Canonical Tag**: Add or fix canonical URLs to prevent duplicate content
- **Open Graph**: Complete Open Graph meta tags for Facebook, LinkedIn, and WhatsApp sharing
- **Twitter Card**: Ensure Twitter cards are properly configured
- **JSON-LD**: Add or fix JSON-LD structured data
- **Image Alt Text**: Add descriptive alt text to all images
- **Keyword Density**: Improve on-page keyword placement
- **Content Quality**: Expand thin content with meaningful copy

## AI-Powered Enhancement

The tool uses AI to:
- Prioritize fixes by impact and effort
- Suggest the most effective, low-hanging changes first
- Provide context-aware recommendations based on the site's current state
- Generate ready-to-implement code snippets for each fix

## Available Recommendations

- **Title Presence**: Ensure page titles are present and descriptive
- **Description Length**: Check that meta descriptions are appropriately sized
- **HTTP Status**: Fix 4xx/5xx errors and ensure proper status codes
- **Title Presence**: Verify title tags are present
- **HTML Language**: Confirm HTML lang attribute is set
- **Viewport**: Ensure responsive design with proper viewport meta tag
- **Canonical Tag**: Add or fix canonical URLs to prevent duplicate content
- **Open Graph**: Complete Open Graph meta tags for social sharing
- **Twitter Card**: Ensure Twitter cards are properly configured
- **JSON-LD**: Add or fix JSON-LD structured data
- **Image Alt Text**: Add descriptive alt text to all images
- **Keyword Density**: Improve on-page keyword placement
- **Content Quality**: Expand thin content with meaningful copy
- **Image Dimensions**: Specify image width and height for performance

## Usage

Call the `/api/suggest` endpoint with a site URL to get personalized recommendations.

## Visitor-Friendly Fixes

Each suggestion includes a clear, actionable fix with a handoff link to the appropriate site tool.
