# AI Resume Parser - Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google AI API Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
```

## Getting Your Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the API key and paste it in your `.env.local` file

## Installation Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Google AI API key

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   - Navigate to `http://localhost:3000`

## Features Available

### ✅ Implemented Features:
- **File Upload**: Upload PDF, DOCX, or TXT files
- **Text Input**: Paste resume text directly
- **AI Enhancement Tools**:
  - ATS Optimization with scoring
  - Tone Adjustment (Formal/Casual)
  - Action Verb Enhancement
- **Real-time Preview**: See formatted resume instantly
- **Download/Print**: Export your resume
- **Copy to Clipboard**: Quick copy functionality
- **Reset Function**: Return to default resume

### 🔧 Technical Features:
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Built with shadcn/ui components
- **TypeScript**: Full type safety
- **Error Handling**: Comprehensive error management
- **Loading States**: Visual feedback for all operations

## Production Deployment

### Vercel Deployment:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production:
```bash
GOOGLE_AI_API_KEY=your_production_api_key
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **"Failed to optimize for ATS" Error:**
   - Check if your Google AI API key is valid
   - Ensure you have sufficient API credits
   - Verify the API key is correctly set in environment variables

2. **File Upload Not Working:**
   - Check file size (must be under 5MB)
   - Verify file type (PDF, DOCX, TXT only)
   - Ensure stable internet connection

3. **Resume Preview Not Updating:**
   - Check browser console for errors
   - Verify resume text format follows the expected structure
   - Try refreshing the page

### Support:
- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)

## File Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── actions.ts      # Server actions
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── file-upload.tsx
│   ├── resume-editor.tsx
│   ├── resume-preview.tsx
│   └── header.tsx
├── ai/                # AI integration
│   ├── flows/         # AI processing flows
│   └── genkit.ts      # AI configuration
└── lib/               # Utilities and constants
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
