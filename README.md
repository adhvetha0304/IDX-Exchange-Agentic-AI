# IDX Exchange — Agentic AI Internship

**Fall 2026 | Agentic AI Development Project**

## Overview

This repository contains my work for the Agentic AI internship at IDX Exchange.

The project involves building an AI-powered real estate assistant using OpenClaw, Python, TypeScript, and MySQL. The main goal is to develop an agent that can understand natural language property queries, search MLS databases, and eventually support features such as market analysis, property recommendations, and conversational interactions.

The project is being developed in stages, with each week focusing on a different component of the system.

## Technology Stack

- **Python** — Data processing, backend development, and database connectivity
- **TypeScript** — Natural language query parsing and testing
- **MySQL** — Storage and querying of property listing data
- **OpenClaw** — AI agent development and orchestration
- **Node.js and npm** — JavaScript runtime and dependency management
- **Pandas and NumPy** — Data processing and numerical computing
- **Scikit-learn** — Machine learning utilities
- **SQLAlchemy and MySQL Connector** — Database connectivity

## Development Progress

### Environment Setup

- [x] Installed and verified Node.js, npm, and OpenClaw
- [x] Configured a Python virtual environment and installed the required dependencies
- [x] Set up a local MySQL development environment
- [x] Imported and verified the provided MLS datasets
- [x] Tested Python-to-MySQL connectivity
- [x] Configured and registered a custom OpenClaw skill
- [ ] Complete AI model integration and end-to-end agent testing

### Week 1 — OpenClaw Architecture Fundamentals

During Week 1, I focused on understanding how OpenClaw works and how its different components can be used to build an AI agent.

I studied the role of skills, channels, sessions, tools, memory, and orchestration, and created an architecture document showing how a property-related query would move through the system, from the user to OpenClaw and eventually to the MLS databases.

**Deliverable:** [Week 1 — OpenClaw Architecture Documentation](docs/week1/Week1_OpenClaw_Architecture.pdf)

### Week 2 — Natural Language Property Search

During Week 2, I developed a property-search skill that takes a natural language query and converts it into structured filters that can later be used to search the MLS database.

The parser supports filters such as city, maximum price, number of bedrooms and bathrooms, property type, square footage, pool, view, and HOA fees.

I implemented the parser in TypeScript, created a Python version for use in the OpenClaw sandbox, and added a command-line interface and deployment script.

**Example query:**

`Show me 3-bedroom condos in Irvine under $1.5M with a pool.`

**Parsed output:**

```json
{
  "city": "Irvine",
  "maxPrice": 1500000,
  "beds": 3,
  "baths": null,
  "sqft": null,
  "type": "Condominium",
  "pool": "True",
  "hasView": null,
  "maxHOA": null
}
```

I tested the parser against 12 different property queries, and all 12 tests passed.

**Deliverable:** [Week 2 — Property Search Skill](skills/property-search/)

### Week 3 — MySQL Property Search Integration

**Status: In progress**

The next step is to connect the structured filters from Week 2 to the MySQL database so that the agent can retrieve actual property listings.

This will involve building parameterized SQL queries, adding pagination, formatting property results, and retrieving comparable sold properties.

## Development Areas

The project will continue to cover the following areas:

- Natural language processing
- Database querying and integration
- Conversational AI and session memory
- Market analysis and property recommendations
- AI agent orchestration
- Retrieval and recommendation techniques
- Application testing and validation

## Data and Security

The MLS datasets are stored locally and are not included in this repository. Database credentials, API keys, and other sensitive configuration files are also excluded.

The database integration will use controlled queries to retrieve only the information needed for each request.
