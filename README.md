# GardenHub Admin Dashboard

A modern admin dashboard for GardenHub built with Next.js 16, React 19, Ant Design, and TailwindCSS.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **UI Library**: Ant Design 5.28.0
- **Styling**: TailwindCSS 4 + Custom CSS
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query (React Query) 5.90.5
- **API**: GraphQL (graphql-request)
- **Internationalization**: next-intl 4.4.0
- **Code Quality**: Biome 2.2.0, Prettier 3.6.2

## 📁 Project Structure

```
gardenhub-admin/
├── app/                          # Next.js App Router directory
│   ├── [locale]/                 # Internationalized routes
│   │   ├── (portal)/            # Main application routes (grouped)
│   │   │   ├── inventory/       # Inventory management pages
│   │   │   ├── products/        # Product management pages
│   │   │   │   ├── add/         # Add product page
│   │   │   │   └── edit/        # Edit product page
│   │   │   ├── orders/          # Order management pages
│   │   │   └── layout.js        # Portal layout wrapper
│   │   └── layout.js            # Locale layout wrapper
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.js                # Root layout
│   ├── not-found.js             # 404 page
│   ├── providers.js             # App-level providers (Query, Intl)
│   └── styles/                  # Additional stylesheets
│       └── overrides.css        # Ant Design component overrides
│
├── components/                   # React components
│   ├── pages/                   # Page-specific components
│   │   └── products/            # Product-related components
│   │       └── add/             # Add/Edit product components
│   │           ├── ProductTabs.js    # Product form tabs
│   │           └── VariantsTab.js    # Variants management
│   ├── shared/                  # Shared/reusable components
│   │   ├── column-actions.jsx   # Table column actions
│   │   ├── cursor-pagination.jsx # Pagination component
│   │   ├── data-table.jsx       # Reusable data table
│   │   ├── delete-modal.jsx     # Delete confirmation modal
│   │   ├── image-gallery.jsx    # Image gallery component
│   │   ├── stats-card.jsx       # Statistics card
│   │   └── tx.jsx               # Translation wrapper
│   ├── ui/                      # UI components
│   │   ├── inputs.jsx           # Form input components
│   │   ├── singleUpload.jsx     # Single image uploader
│   │   ├── uploaderM.jsx        # Multiple image uploader
│   │   ├── select-dropdowns/    # Dropdown components
│   │   │   └── CategoryCascader.jsx # Category selector
│   │   └── ...                  # Other UI components
│   └── wrappers/                # Layout wrappers
│       ├── box.jsx              # Box container component
│       └── modal-wrapper.jsx    # Modal wrapper
│
├── hooks/                        # Custom React hooks
│   ├── useAttribute.js          # Attribute management hooks
│   ├── useAuth.js               # Authentication hooks
│   ├── useCategories.js         # Category management hooks
│   ├── useCursorPagination.js   # Pagination logic hook
│   ├── useInventory.js          # Inventory management hooks
│   └── useProduct.js            # Product CRUD hooks
│
├── lib/                          # Utility libraries
│   ├── api/                     # API layer
│   │   ├── client.js            # Axios HTTP client
│   │   ├── endpoints.js         # REST API endpoints
│   │   ├── graphql-client.js    # GraphQL client setup
│   │   └── queries.js           # GraphQL queries
│   ├── columns/                 # Table column definitions
│   │   ├── inventory-cols.js    # Inventory table columns
│   │   ├── order-cols.js        # Order table columns
│   │   └── product-cols.js      # Product table columns
│   ├── const/                   # Constants
│   │   ├── icons.js             # Icon constants
│   │   ├── pagination.js        # Pagination constants
│   │   └── validations.js       # Form validation rules
│   └── utils/                   # Utility functions
│       ├── helpers.js           # General helper functions
│       └── productUtils.js      # Product-specific utilities
│
├── i18n/                         # Internationalization
│   ├── navigation.js            # i18n navigation config
│   ├── request.js               # i18n request handler
│   └── routing.js               # i18n routing config
│
├── messages/                     # Translation files
│   ├── en.json                  # English translations
│   └── ar.json                  # Arabic translations
│
├── public/                       # Static assets
│   └── shared/                  # Shared icons/images
│
├── store/                        # Zustand state stores
│   └── ...                      # Global state management
│
├── theme/                        # Theme configuration
│   └── antd-provider.js         # Ant Design theme provider
│
├── middleware.js                # Next.js middleware (i18n)
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # TailwindCSS configuration
└── package.json                 # Project dependencies
```

## 🏗️ Architecture Overview

### App Router Structure
The project uses Next.js 16's App Router with the following routing strategy:
- **Internationalization**: Routes are wrapped in `[locale]` for multi-language support
- **Route Groups**: The `(portal)` group organizes authenticated routes without affecting URLs
- **File-based Routing**: Each folder represents a route segment

### Component Organization
Components are organized by purpose:
- **`components/pages/`**: Page-specific components that are tightly coupled to routes
- **`components/shared/`**: Reusable components used across multiple pages
- **`components/ui/`**: Generic UI components and form inputs
- **`components/wrappers/`**: Layout and structural components

### Data Management
- **TanStack Query**: Handles server state, caching, and data synchronization
- **Zustand**: Manages client-side global state
- **Custom Hooks**: Encapsulate data fetching and business logic

### API Layer
- **GraphQL**: Primary API communication via `graphql-request`
- **REST**: Fallback for file uploads and specific endpoints via Axios
- **Type Safety**: GraphQL queries defined in `lib/api/queries.js`

### Styling Strategy
- **TailwindCSS**: Utility-first styling for rapid development
- **Ant Design**: Pre-built components with custom theme
- **CSS Variables**: Global design tokens in `globals.css`
- **Component Overrides**: Ant Design customizations in `styles/overrides.css`

## 🎨 Key Features

### Product Management
- **Variants Support**: Manage product variations (size, color, etc.)
- **Conditional Stock Tracking**: Track inventory at product or variant level
- **Image Management**: Single main image + multiple additional images
- **Dynamic Attributes**: Filter attributes with multi-select support
- **SEO Optimization**: Meta tags and keywords management

### Inventory Management
- **Real-time Stock Tracking**: Monitor current stock levels
- **Low Stock Alerts**: Configurable threshold warnings
- **Transaction History**: Track inventory adjustments
- **Bulk Actions**: Update multiple items simultaneously

### Internationalization
- **Multi-language Support**: English and Arabic
- **RTL Support**: Right-to-left layout for Arabic
- **Translation Management**: JSON-based translation files

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands

```bash
# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GRAPHQL_URL=your_graphql_url
```

### Theme Customization
Modify `theme/antd-provider.js` to customize Ant Design theme:
- Primary color
- Border radius
- Component-specific styles
- Font family (currently using Outfit)

### Internationalization
Add new languages by:
1. Creating a new JSON file in `messages/`
2. Updating `i18n/routing.js` with the new locale
3. Adding translations to the new JSON file

## 📝 Code Conventions

### File Naming
- **Components**: PascalCase (e.g., `ProductTabs.js`)
- **Utilities**: camelCase (e.g., `productUtils.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useProduct.js`)

### Component Structure
- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused and single-purpose
- Use Ant Design's Form.Item with custom wrappers

### State Management
- **Server State**: Use TanStack Query hooks
- **Client State**: Use Zustand for global state
- **Local State**: Use React's useState for component-local state

## 🔗 API Integration

### GraphQL Queries
All GraphQL queries are centralized in `lib/api/queries.js`:
- `CATEGORY_QUERIES`: Category management
- `ATTRIBUTES_QUERIES`: Product attributes
- `PRODUCTS_QUERIES`: Product CRUD operations
- `INVENTORY_QUERIES`: Inventory management

### Custom Hooks Pattern
Each resource has a dedicated hook file:
```javascript
// Example: useProduct.js
export const useProducts = () => useQuery(...)
export const useProductEdit = (id) => useQuery(...)
export const useCreateProduct = () => useMutation(...)
export const useUpdateProduct = () => useMutation(...)
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Optimized for Next.js (recommended)
- **Docker**: Containerized deployment
- **Node.js Server**: Self-hosted option

## 🤝 Contributing

1. Follow the existing code structure
2. Use Prettier for code formatting
3. Run linter before committing
4. Write descriptive commit messages
5. Test thoroughly before submitting PRs

## 📄 License

Private project - All rights reserved

---

Built with ❤️ for GardenHub
