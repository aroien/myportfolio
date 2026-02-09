# Portfolio Project Preview Feature

## Overview
Your portfolio now includes a **hover preview feature** for project cards that displays a visual preview when users hover over them.

## How it Works

### Preview Types
1. **Live Iframe Preview** - Shows live website in iframe (best for deployed projects)
2. **Image Preview** - Shows screenshot/mockup image
3. **Fallback Preview** - Default placeholder when no preview is specified

## Adding a New Project

### Option 1: Live Preview (Recommended for deployed projects)
```javascript
{
  title: "Your Project Name",
  description: "Project description here...",
  tech: ["React", "TypeScript", "Tailwind"],
  link: "https://your-project.com",
  featured: true,
  previewUrl: "https://your-project.com"  // 👈 Live preview
}
```

### Option 2: Image Preview
```javascript
{
  title: "Your Project Name",
  description: "Project description here...",
  tech: ["React", "Node.js"],
  link: "https://github.com/yourusername/project",
  featured: false,
  previewImage: "https://yourimage.com/screenshot.png"  // 👈 Image URL
}
```

### Option 3: Local Images
Store images in `/public/images/` folder and reference them:
```javascript
{
  title: "Your Project Name",
  previewImage: "/images/project-screenshot.png"
}
```

## Scalability Features

### ✅ Modular Component Structure
- `ProjectCard.js` is a separate, reusable component
- Easy to maintain and update
- Can be used across different pages

### ✅ Flexible Preview System
- Supports multiple preview types (iframe, image, fallback)
- Automatically chooses best preview method
- Gracefully handles missing previews

### ✅ Easy to Extend
Want to add more features? Just update `ProjectCard.js`:
- Add animation options
- Include video previews
- Add tags/categories
- Custom hover effects

## Tips for Best Results

1. **Image Quality**: Use high-quality screenshots (minimum 800x600px)
2. **Free Image Sources**:
   - Unsplash: https://unsplash.com
   - Your actual project screenshots
   - Figma mockups exported as PNG

3. **Performance**: Optimize images before uploading
   - Use WebP format when possible
   - Keep file sizes under 500KB
   - Lazy loading is automatic

4. **iframe Considerations**:
   - Some sites block iframe embedding (use image preview instead)
   - Live previews may load slower
   - Only use for your own deployed projects

## Example Projects Array

```javascript
const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-featured shopping platform...",
    tech: ["React", "Redux", "Node.js"],
    link: "https://my-shop.com",
    featured: true,
    previewUrl: "https://my-shop.com",  // Live preview
  },
  {
    title: "Portfolio Website", 
    description: "Personal portfolio with dark theme...",
    tech: ["React", "Tailwind"],
    link: "https://github.com/user/portfolio",
    featured: false,
    previewImage: "/images/portfolio-preview.png",  // Local image
  },
  {
    title: "Mobile App Mockup",
    description: "iOS/Android app design...",
    tech: ["Figma", "React Native"],
    link: "#",
    featured: false,
    previewImage: "https://i.imgur.com/abc123.png",  // External image
  }
];
```

## Future Enhancements

Consider adding:
- [ ] Video previews (GIF or MP4)
- [ ] Lightbox/modal for full-size preview
- [ ] Multiple screenshots carousel
- [ ] Filter projects by technology
- [ ] Search functionality
- [ ] Project categories
- [ ] GitHub stars/stats integration

## Need Help?

The preview feature is fully responsive and works on:
- ✅ Desktop (hover effect)
- ✅ Tablets (touch to preview)
- ✅ Mobile (tap to view)

Happy coding! 🚀
