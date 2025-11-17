# Deep SQL Researcher

🎬 **Transform SQL research into polished video presentations automatically**

While browsing LinkedIn, I came across a post from a YC funded company discussing their work on a deep researcher for BI analytics. Intrigued by the concept, I decided to explore it further. Having previously built both a calendar SQL agent and a deep researcher, I realized I could combine these two ideas into a single project—and take it a step further by generating video presentations from the insights.

To test this agent-driven workflow, I needed a suitable dataset. After some searching, I discovered a dataset on [GitHub](https://github.com/lerocha/netflixdb), which contains a dump of Netflix data from their Engagement Report. This dataset serves as an excellent foundation for experimentation and development.

## 🚀 What It Does

Deep SQL Researcher is an end-to-end pipeline that:

1. **Research**: Uses LangGraph agents to analyze SQL databases and generate insights
2. **Narrative**: Creates compelling story structures from data findings  
3. **Design**: Automatically designs video cards and layouts
4. **Render**: Produces polished video presentations using Remotion

### Key Features

- 🤖 **AI-Powered Research**: LangGraph agents that understand your data goals
- 📊 **Structured Insights**: Automatic extraction of trends, comparisons, and statistics
- 🎭 **Narrative Generation**: Compelling story structures for data presentation
- 🎨 **Dynamic Card Design**: Multiple card variants (hero stats, rankings, comparisons, charts)
- 🎬 **Video Rendering**: Professional-quality videos with animations and transitions
- 🎯 **Type-Safe Pipeline**: Full TypeScript integration from database to video

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Research      │    │    Narrative     │    │    Video        │
│   Agent         │───▶│    Planning      │───▶│    Renderer     │
│                 │    │                  │    │                 │
│ • SQL Queries   │    │ • Story Structure│    │ • Card Design   │
│ • Insights      │    │ • Scene Planning │    │ • Animations    │
│ • Data Analysis │    │ • Timeline Build │    │ • Video Output  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Packages

- **`packages/agent`** - LangGraph-based research agent with narrative generation
- **`packages/shared`** - TypeScript types and schemas for the entire pipeline
- **`apps/renderer`** - Remotion-based video renderer with dynamic card components

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd deep-sql-research

# Install dependencies
bun install

# Build all packages
bun run build
```

## 🎬 Quick Start

### Generate Your First Video

```bash
# Interactive mode (prompts for goal and database)
bun run packages/agent/src/index.ts

# Or use the complete pipeline
bun run generate-video
```

### Step-by-Step Workflow

```bash
# 1. Generate research insights and template
bun run packages/agent/src/index.ts > template.json

# 2. Render video from template
bun run apps/renderer/src/cli.ts template.json

# 3. Preview the video
cd apps/renderer && bun run dev
```

### Example Research Goals

- "Analyze Netflix content performance to understand what makes a show successful"
- "Compare viewer engagement between movies and TV series"
- "Identify trends in content release patterns and their impact on ratings"

## 📁 Project Structure

```
deep-sql-research/
├── packages/
│   ├── agent/                 # LangGraph research agent
│   │   ├── src/
│   │   │   ├── agent/         # Graph definitions and state
│   │   │   ├── nodes/         # Individual processing nodes
│   │   │   ├── helpers/       # Database, LLM, and utilities
│   │   │   ├── fixtures/      # Test research scenarios
│   │   │   └── tests/         # Template generation tests
│   │   └── netflixdb.sqlite   # Sample Netflix dataset
│   └── shared/                # Shared types and schemas
│       └── src/
│           ├── types.ts       # Core data structures
│           ├── schemas.ts     # Zod validation schemas
│           └── constants.ts   # Node and type constants
├── apps/
│   └── renderer/              # Remotion video renderer
│       ├── src/
│       │   ├── components/    # Dynamic card components
│       │   ├── animations/    # Motion presets and transitions
│       │   ├── themes/        # Visual theming system
│       │   ├── cli.ts         # Video rendering CLI
│       │   └── VideoRoot.tsx  # Main Remotion composition
└── package.json               # Workspace configuration
```

## 🎯 Development

### Available Scripts

```bash
# Development
bun run dev                    # Start development servers
bun run build                  # Build all packages
bun run type-check             # Type checking across workspace

# Agent Development
bun run studio                 # LangGraph studio for agent debugging
bun run test                   # Run agent tests with snapshots

# Video Rendering
cd apps/renderer
bun run dev                    # Preview server
bun run build                  # Render video
bun run render <template.json> # CLI video rendering
```

### Testing

```bash
# Run all tests
bun run test

# Run specific test suites
cd packages/agent && bun test src/tests/template-generation.test.ts
```

## 🎨 Video Components

The renderer supports multiple card variants:

- **`hero_stat`** - Large, prominent statistics
- **`ranked_list`** - Ordered rankings with highlights
- **`comparison_split`** - Side-by-side comparisons
- **`trend_chart`** - Time-based trend visualizations
- **`distribution_chart`** - Statistical distributions
- **`key_highlight`** - Important insight callouts

### Animation Presets

- **Cinematic slide-up** - Dramatic entrance animations
- **Scale pop** - Bouncy, attention-grabbing effects
- **Fade in** - Smooth transitions
- **Slide variants** - Directional movement effects

## 🔧 Configuration

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure your LLM provider (OpenAI, Anthropic, etc.)
3. Set up database connections

### Custom Databases

Replace `netflixdb.sqlite` with your own SQLite database:

```bash
# Place your database in packages/agent/
cp your-database.sqlite packages/agent/
```

## 📊 Data Flow

1. **Input**: Research goal and database path
2. **Research**: Agent generates SQL queries and extracts insights
3. **Synthesis**: Insights are structured into narrative outline
4. **Planning**: Scenes are planned with layout presets
5. **Design**: Cards are designed with variants and styling
6. **Timeline**: Complete video timeline is constructed
7. **Template**: Final JSON template is assembled
8. **Render**: Video is generated from template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `bun run type-check` and `bun run test`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Netflix Dataset](https://github.com/lerocha/netflixdb) for the sample data
- [LangGraph](https://langchain-ai.github.io/langgraph/) for the agent framework
- [Remotion](https://www.remotion.dev/) for video generation
- [Bun](https://bun.sh/) for the fast JavaScript runtime
