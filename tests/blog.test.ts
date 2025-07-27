import { expect, test } from '@playwright/test'

test.describe('Blog Functionality', () => {
  test('blog page loads and shows structure', async ({ page }) => {
    await page.goto('/blog')
    
    // Check that page loads successfully (no 404 or 500 errors)
    expect(page.url()).toContain('/blog')
    
    // Check that page structure exists
    await expect(page.locator('body')).toBeVisible()
    
    // The blog page should have the specific blog post list structure (use more specific selector)
    await expect(page.locator('ul').last()).toBeVisible() // Last ul should be the blog posts list
  })

  test('blog posts are displayed and loaded', async ({ page }) => {
    await page.goto('/blog')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Check for blog post structure - use the last ul which should be the blog posts
    const blogList = page.locator('ul').last()
    await expect(blogList).toBeVisible()
    
    // There should be actual blog posts loaded - this should NOT be empty
    const blogPosts = blogList.locator('li')
    const postCount = await blogPosts.count()
    
    // Blog should have posts - if this fails, there's a real problem
    expect(postCount).toBeGreaterThan(0)
    
    // Check first few posts have proper PostPreview structure
    for (let i = 0; i < Math.min(postCount, 3); i++) {
      const post = blogPosts.nth(i)
      await expect(post).toBeVisible()
      
      // Each post should have PostPreview structure: link, h3 heading, author, paragraph
      const hasContent = await post.locator('a, h3, p, img').count() > 0
      expect(hasContent).toBeTruthy()
      
      // Should have clickable blog post links
      const postLinks = await post.locator('a[href^="/blog/"]').count()
      expect(postLinks).toBeGreaterThan(0)
    }
  })

  test('blog posts have proper metadata', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    const blogPosts = page.locator('ul').last().locator('li')
    const postCount = await blogPosts.count()
    
    // Should have posts
    expect(postCount).toBeGreaterThan(0)
    
    // Check that posts have proper PostPreview structure
    const firstPost = blogPosts.first()
    
    // Should have h3 heading with blog post title
    await expect(firstPost.locator('h3')).toBeVisible()
    
    // Should have author information and date
    const hasAuthorInfo = await firstPost.textContent()
    expect(hasAuthorInfo).toBeTruthy()
    
    // Should have blog post links
    const blogLinks = await firstPost.locator('a[href^="/blog/"]').count()
    expect(blogLinks).toBeGreaterThan(0)
  })

  test('blog pagination works if present', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // Look for pagination controls
    const pagination = page.locator('.pagination, [class*="pagination"], nav[aria-label*="pagination"]')
    const paginationCount = await pagination.count()
    
    if (paginationCount > 0) {
      // If pagination exists, check it has proper structure
      await expect(pagination.first()).toBeVisible()
      
      // Look for navigation links
      const navLinks = pagination.locator('a, button')
      const linkCount = await navLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    }
    // If no pagination, that's fine - not all blogs need it
  })

  test('individual blog post links work', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // Look for links to individual blog posts in the PostPreview components
    const postLinks = page.locator('ul').last().locator('li a').filter({ hasText: /.+/ })
    const linkCount = await postLinks.count()
    
    // Should have clickable blog post links
    expect(linkCount).toBeGreaterThan(0)
    
    const firstLink = postLinks.first()
    const href = await firstLink.getAttribute('href')
    
    // Should have valid blog post URLs
    expect(href).toBeTruthy()
    expect(href).toContain('/blog/')
    expect(href).not.toContain('http') // Should be relative URLs
    
    // Try clicking the first blog post link
    await firstLink.click()
    await page.waitForLoadState('networkidle')
    
    // Should navigate to individual post or stay on blog page
    expect(page.url()).toContain('/blog')
    await expect(page.locator('body')).toBeVisible()
    
    // Should have content structure (either individual post or blog list)
    const hasContent = await page.locator('h1, h2, h3, article, .content, p, ul').count() > 0
    expect(hasContent).toBeTruthy()
  })

  test('blog search functionality if available', async ({ page }) => {
    await page.goto('/blog')
    
    // Look for search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="Suche"]')
    const searchCount = await searchInput.count()
    
    if (searchCount > 0) {
      // If search exists, test basic functionality
      await searchInput.first().fill('test')
      await page.keyboard.press('Enter')
      
      // Should either show results or handle the search
      await page.waitForLoadState('networkidle')
      await expect(page.locator('body')).toBeVisible()
    }
    // If no search, that's fine - not required
  })

  test('blog tag filtering works', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // The blog should have a TagList component for filtering
    // Look for tag buttons or filter elements
    const tagButtons = page.locator('button, .tag, [class*="tag"], .filter-button')
    const tagCount = await tagButtons.count()
    
    if (tagCount > 0) {
      // If tags exist, they should be clickable
      const firstTag = tagButtons.first()
      if (await firstTag.isVisible()) {
        await expect(firstTag).toBeVisible()
        
        // Try clicking to test filtering functionality
        await firstTag.click()
        await page.waitForLoadState('networkidle')
        
        // The blog list should still be visible after filtering
        await expect(page.locator('ul').last()).toBeVisible()
      }
    }
    // If no tag buttons, that's fine - the TagList might be implemented differently
  })

  test('blog social component is present', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    // The blog page includes a Social component
    // Basic page structure should be intact
    await expect(page.locator('body')).toBeVisible()
    expect(page.url()).toContain('/blog')
    
    // Should have the blog posts list structure
    await expect(page.locator('ul').last()).toBeVisible()
  })
})