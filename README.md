# 🕚 TimeSpot - World Clock Application

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)


> A modern, responsive world clock application built with React, TypeScript, and Vite. Features real-time updates, day/night indicators, and an intuitive interface for tracking time across multiple cities and time zones.

## 📸 Screenshots

![TimeSpot App Screenshot](https://i.imgur.com/itiXSyh.png)

*Beautiful, responsive design that adapts to any screen size*

## ✨ Features

- 🕐 **Real-time Clock Display** - Live updates for multiple time zones
- 🌅 **Day/Night Indicators** - Visual cues based on local sunrise/sunset times
- 🔍 **City Search & Selection** - Easy-to-use search functionality
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🎨 **Adaptive Typography** - Dynamic text sizing based on available space
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🧪 **TypeScript Support** - Full type safety throughout the application
- 🎯 **Accessible UI** - WCAG compliant interface

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hugomrvt/mrvt-timespot.git
   cd mrvt-timespot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Scripts](#-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Tech Stack](#-tech-stack)
- [Credits](#-credits)
- [License](#-license)

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint with error reporting |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ResponsivePrimaryTimeDisplay.tsx
│   ├── PrimaryTimeDisplay.tsx
│   ├── ResponsiveTimeZoneGrid.tsx
│   ├── TimeZoneCard.tsx
│   └── Credits.tsx
├── hooks/              # Custom React hooks
│   ├── useTimeZoneData.ts
│   ├── useSunData.ts
│   ├── useAdaptiveTextSize.ts
│   └── useBreakpoint.ts
├── services/           # Local API service (no backend)
│   └── localTimeApi.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── timezoneUtils.ts
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🏗️ Architecture

TimeSpot follows a modular, hook-based architecture with a local data service:

### Core Components
- **ResponsivePrimaryTimeDisplay**: Main time display with adaptive sizing
- **ResponsiveTimeZoneGrid**: Grid layout for multiple time zones
- **TimeZoneCard**: Individual time zone display cards

### Custom Hooks
- **useTimeZoneData**: Manages time zone information and real-time updates
- **useSunData**: Provides sunrise/sunset data from local cache
- **useAdaptiveTextSize**: Dynamic font sizing based on container width
- **useBreakpoint**: Responsive design breakpoint detection

### Services
- **localTimeApi**: Local data service that reads from `.docs/timezone.json`, caches in-memory, and persists preferences to `localStorage`.

## 🌐 Environment Variables

No environment variables are required by default. Everything works locally with the bundled JSON data and localStorage.

## 🚀 Deployment

### Static Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your preferred hosting platform:
   - [Vercel](https://vercel.com/)
   - [Netlify](https://netlify.com/)
   - [GitHub Pages](https://pages.github.com/)
   - [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Server Functions

None required.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   npm run typecheck && npm run lint && npm run format
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://reactjs.org/)** - Modern React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks (optional)

## 🎨 Design Credits

- **Original Design Inspiration**: [Nixtio on Dribbble](https://dribbble.com/shots/26022641-Dashboard-World-Clock-UI)
- **Implementation**: [Hugo Mourlevat](https://linkedin.com/in/hugomrvt)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
  **[⭐ Star this repository](https://github.com/hugomrvt/mrvt-timespot)** if you find it helpful!
  
  Made with **Figma Make** & **Trae** by [Hugo Mourlevat](https://linkedin.com/in/hugomrvt)
  
</div>
