# **App Name**: FlowForge AI

## Core Features:

- Text Generation: Generates text using Google Gemini Pro/Flash LLMs, with the ability to filter the response.
- Image Generation: Generate images from text prompts using Stable Diffusion SDXL, DALL-E, Vertex, Imagen, and others. It supports using a tool for image recognition to improve prompt generation based on visual input.
- Video Generation: Generate videos (5-8 seconds) using models like ModelScope, Runway Gen 3/Gen 4, Google Veo, Kling/Wan and others, potentially using the output from another node as a tool to refine the video generation based on image content.
- Audio Generation: Generate music, sound effects, or speech using SUNO v3.5/v4.0 or a simple TTS service.
- Asset Upload and Management: Enables the user to drag and drop or select image and video assets with automatic type detection, which can then be used to build node pipelines
- Visual Node Editor: A canvas (12x12 grid) with a maximum of 144 nodes. These nodes are connected as chains to accomplish cascading generation of the images, texts, video, and audio assets
- Subscription via Telegram Payments: Implements a monthly/yearly subscription model through Telegram Payments. Users get 3 free generations before needing a subscription, and FE initiates invoice via BE.

## Style Guidelines:

- Primary color: Saturated purple (#9400D3) to convey innovation and creativity.
- Background color: Light desaturated purple (#E6E0EB) to maintain a connection to the primary color while providing a calm backdrop.
- Accent color: Analogous blue (#4682B4), more saturated and darker than the primary color, to highlight interactive elements.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and readable interface.
- lucide-react icon library.
- Liquid glass / стекломорфизм UI, soft shadows, rounded corners (rounded-2xl), acryl/blur, smooth animations (Framer Motion). Light / Dark theme toggle.
- Subtle, fluid animations to indicate data flow between nodes and task completion, using Framer Motion.