# SDK Documentation JSON Schema

This document is the authoritative reference for the JSON format that powers Auth0's SDK API reference pages. Every file under `sdk-data/{sdk-id}/{version}.json` must conform to this schema.

The JSON is consumed by `scripts/generate-sdk-docs.mjs`, which generates MDX pages, builds sidebar navigation, and updates `docs.json`. The rendered output lives at `docs/libraries/{sdk-id}/{version}/{page-id}`.

---

## How content gets into the docs repo

There are two types of content for an SDK — both originate in the **SDK repo**, not here.

| Type | Who writes it | How it's written | Example pages |
|------|--------------|-----------------|---------------|
| **API reference** | Generated automatically from SDK source | JSON (`{version}.json`) | `AuthClient`, `getUser`, `useAuth0` |
| **Guide pages** | Written manually by a developer | Plain Markdown (`.md` files) | Introduction, Quickstart, Migration Guide |

A CI job in the SDK repo runs on every release and opens a PR in this repo delivering:

```
sdk-data/
  {sdk-id}/
    v2.json          ← generated API reference
    v3.json
    guides/
      introduction.md      ← written by a developer in the SDK repo
      quickstart.md
      migration-v2.md
```

The generator picks up both the JSON and the `.md` files and produces pages that all share the same SDK layout — same sidebar, same version switcher, same styling.

> Guide `.md` files are shared across all versions of an SDK by default. If a guide is version-specific (e.g. a migration guide), name it clearly: `migration-v2-to-v3.md`.

---

## File Location and Naming

```
main/
  sdk-data/
    {sdk-id}/           e.g. auth0-react, auth0-go, auth0-python, nextjs-auth0
      {version}.json    e.g. v2.json, v3.json, v4.json
      guides/
        {id}.md         e.g. introduction.md, quickstart.md, migration-v2.md
```

**SDK ID rules:**
- Use the npm/pip/module package name, lowercased, hyphens only.
- Must match an entry in `SDK_LABELS` and `SDK_ICON_FILE` in `generate-sdk-docs.mjs` for the label and icon to appear correctly. If adding a new SDK, update those maps in the generator.

**Version rules:**
- Format: `v{major}` (e.g. `v2`, `v3`). Do not include minor/patch.
- Multiple versions of the same SDK are supported. All versions are listed in the sidebar version dropdown, sorted descending.
- The file that sorts highest (e.g. `v3.json`) becomes the default landing version.

**Guide file rules:**
- Filename must match the `id` used in `navigation` and `pages`. `introduction.md` → `id: "introduction"`.
- Plain Markdown only — no MDX, no JSX, no frontmatter needed.
- The generator reads the file and wraps it in the SDK layout automatically.

---

## Top-Level Structure

```json
{
  "meta": { ... },
  "navigation": [ ... ],
  "pages": { ... }
}
```

All three top-level keys are required.

---

## `meta` Object

Metadata about this SDK version. All fields are optional except where noted.

```json
"meta": {
  "package": "@auth0/auth0-react",
  "version": "2.2.4",
  "status": "active",
  "generatedAt": "2025-01-10T00:00:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package` | string | No | The package name as published on npm/pip/pkg.go.dev/etc. Used for display only. |
| `version` | string | No | The exact package version this documentation was generated from (e.g. `"2.2.4"`). |
| `status` | string | No | `"active"` (default) or `"deprecated"`. Deprecated versions show a `(Deprecated)` label in the version dropdown and in `docs.json`. |
| `generatedAt` | string | No | ISO 8601 timestamp of when this file was generated. Useful for auditing. |

**`status` values:**

| Value | Effect |
|-------|--------|
| `"active"` | Normal display. This is the default when the field is absent. |
| `"deprecated"` | Appends `(Deprecated)` to the version label everywhere it appears. |

---

## `navigation` Array

Defines the left sidebar structure. An ordered array of section objects. The order here is the order in the sidebar.

Guide pages and API reference pages live in the same navigation — there is no separation.

```json
"navigation": [
  {
    "section": "Getting Started",
    "items": [
      { "id": "introduction",  "title": "Introduction",    "kind": "guide" },
      { "id": "quickstart",    "title": "Quickstart",      "kind": "guide" },
      { "id": "migration-v2",  "title": "Migrating to v2", "kind": "guide" }
    ]
  },
  {
    "section": "Auth Client",
    "items": [
      { "id": "auth-client", "title": "AuthClient", "kind": "class" },
      { "id": "get-token",   "title": "getToken",   "kind": "function" }
    ]
  },
  {
    "section": "Types",
    "items": [
      { "id": "auth-options", "title": "AuthOptions", "kind": "interface" }
    ]
  }
]
```

### Section Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section` | string | Yes | Section heading shown in the sidebar above the item list. |
| `items` | NavItem[] | Yes | Ordered list of pages within this section. |

### NavItem Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Must exactly match a key in the `pages` map. This becomes the URL slug: `docs/libraries/{sdk}/{version}/{id}`. |
| `title` | string | Yes | Display name shown in the sidebar link. Should match `pages[id].title`. |
| `kind` | string | No | Include for clarity. Use `"guide"` for developer-written pages, or the appropriate API reference kind. |

**ID rules:**
- Lowercase, hyphens only. No spaces, no slashes, no dots.
- Must be unique across the entire file (not just within a section).
- For guide pages, the ID must match the `.md` filename in `guides/`. `"introduction"` → `guides/introduction.md`.
- Good: `"auth-client"`, `"use-auth0"`, `"migration-v2"`
- Bad: `"AuthClient"`, `"get token"`, `"auth/client"`

---

## `pages` Map

A flat object where each key is a page ID (matching `navigation` items) and the value is a Page object.

```json
"pages": {
  "introduction": { ... },
  "auth-client":  { ... },
  "get-token":    { ... }
}
```

Every ID referenced in `navigation[*].items[*].id` must have a corresponding entry here. Extra entries in `pages` that are not in `navigation` will generate MDX files but will not appear in the sidebar.

---

## Guide Page Object

For guide pages, the entry in `pages` is a stub — just `title` and `kind`. The content comes from the `.md` file in `guides/`.

```json
"introduction": {
  "title": "Introduction",
  "kind": "guide"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Displayed as the page `<h1>`. Also used in the browser tab title and SEO. |
| `kind` | string | Yes | Must be `"guide"`. Tells the generator to look for `guides/{id}.md` for the content. |

The generator reads `guides/{id}.md`, wraps it in the SDK layout, and generates the MDX page. No other fields are needed.

---

## API Reference Page Object

The full set of fields an API reference page can have. Most are optional — only include fields that have real content. Empty arrays and null values are ignored by the renderer.

```json
{
  "id": "auth-client",
  "title": "AuthClient",
  "kind": "class",
  "description": "Main client for Auth0 API interactions.",
  "signature": "class AuthClient",
  "constructor": { ... },
  "parameters": [ ... ],
  "properties": [ ... ],
  "members": [ ... ],
  "returns": { ... },
  "throws": [ ... ],
  "examples": [ ... ],
  "type": "string | null"
}
```

### Page Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Must match the key in `pages` and the corresponding `navigation` item ID. |
| `title` | string | Yes | Displayed as the page `<h1>`. Also used in the browser tab title. |
| `kind` | string | Yes | Drives the badge and determines which sections the renderer shows. See [Kind Values](#kind-values) below. |
| `description` | string | No | Lead paragraph below the title. Supports a subset of Markdown (bold, inline code, links). First line is also used as the SEO `description` meta tag. |
| `signature` | string | No | The full type/function signature, rendered as a code block immediately after the description. Use the language's native syntax exactly as it appears in the source. |
| `constructor` | Constructor | No | Present only on `kind: "class"` pages. Renders a "Constructor" section with the constructor signature and its parameters. |
| `parameters` | Parameter[] | No | Function or method parameters. Renders a "Parameters" section with a definition list. |
| `properties` | Property[] | No | Object properties. Renders a "Properties" section as a table with Name / Type / Description columns. |
| `members` | Member[] | No | Methods or properties belonging to a class. Each member renders as its own sub-section with its own signature, parameters, and returns. |
| `returns` | Returns | No | The return value. Renders a "Returns" section. |
| `throws` | Parameter[] | No | Errors/exceptions the function can throw. Renders a "Throws" section using the same definition list as Parameters. |
| `examples` | Example[] | No | Code examples. One example renders as a plain code block. Two or more render as tabs. |
| `type` | string | No | For type alias pages. Renders the type definition inline. |

---

## Nested Object Types

### `Constructor`

Used only on `kind: "class"` pages. Describes how to instantiate the class.

```json
"constructor": {
  "signature": "new AuthClient(options: AuthClientOptions)",
  "parameters": [
    {
      "name": "options",
      "type": "AuthClientOptions",
      "optional": false,
      "description": "Configuration options for the client."
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `signature` | string | Yes | The full constructor signature in native language syntax. |
| `parameters` | Parameter[] | No | Parameters the constructor accepts. Same shape as top-level `parameters`. |

---

### `Parameter`

Used in `parameters`, `constructor.parameters`, and `throws`.

```json
{
  "name": "userId",
  "type": "string",
  "optional": false,
  "default": null,
  "description": "The unique identifier of the user to fetch."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Parameter name as it appears in the signature. |
| `type` | string | Yes | The type, in the language's own syntax. For TypeScript: `string`, `User \| null`, `Record<string, unknown>`. For Python: `str`, `Optional[str]`. For Go: `context.Context`, `string`, `...Option`. |
| `optional` | boolean | No | `true` if the parameter is optional. Renders an "Optional" label. Default: `false`. |
| `default` | string | No | Default value as a string. Renders a "Default: `value`" label when present. |
| `description` | string | Yes* | What the parameter does. *Technically optional in the schema but a missing description makes the section nearly useless. Always include one. |

**For `throws`:** Use `name` for the error/exception class name (e.g. `"AuthenticationError"`) and `description` to explain when it is thrown.

---

### `Property`

Used in `properties`. Rendered as a table row.

```json
{
  "name": "isAuthenticated",
  "type": "boolean",
  "description": "True when the user has an active session."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Property name. |
| `type` | string | Yes | The type in native syntax. |
| `description` | string | Yes* | What the property represents. *Always include one. |

---

### `Member`

Used in `members`. Represents a method or sub-property on a class. Each member renders as a full sub-section on the page.

```json
{
  "id": "get-user",
  "title": "getUser",
  "kind": "method",
  "signature": "getUser(id: string): Promise<User>",
  "description": "Fetches a user by their unique identifier.",
  "parameters": [
    {
      "name": "id",
      "type": "string",
      "optional": false,
      "description": "The Auth0 user ID (e.g. auth0|abc123)."
    }
  ],
  "returns": {
    "type": "Promise<User>",
    "description": "Resolves to the user object."
  },
  "throws": [
    {
      "name": "ManagementApiError",
      "type": "ManagementApiError",
      "description": "Thrown when the user is not found or the API returns an error."
    }
  ],
  "examples": [
    {
      "title": "Fetch by ID",
      "language": "typescript",
      "code": "const user = await management.getUser('auth0|abc123');"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique within this page. Used as a heading anchor. Lowercase, hyphens only. |
| `title` | string | Yes | The method/property name. Rendered as a `<h2>` sub-heading. |
| `kind` | string | No | `"method"` or `"property"`. Drives any badge. |
| `signature` | string | No | Full method signature. |
| `description` | string | No | What the member does. |
| `parameters` | Parameter[] | No | Method parameters. |
| `returns` | Returns | No | Return value. |
| `throws` | Parameter[] | No | Exceptions this member can throw. |
| `examples` | Example[] | No | Code examples scoped to this member. |

---

### `Returns`

```json
"returns": {
  "type": "Promise<User>",
  "description": "Resolves to the full user profile object."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | The return type in native syntax. |
| `description` | string | No | What the return value represents. |

---

### `Example`

```json
{
  "title": "With custom scopes",
  "language": "typescript",
  "code": "const token = await auth0.getAccessTokenSilently({\n  authorizationParams: { scope: 'openid profile read:data' }\n});"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes* | Tab label shown when there are multiple examples. *Required when the page has 2 or more examples — without a title the tab falls back to the language name, which is confusing when multiple examples use the same language. |
| `language` | string | Yes | Language identifier for syntax highlighting. See [Supported Languages](#supported-languages). |
| `code` | string | Yes | The raw code string. Use `\n` for line breaks. Do not indent the entire block — the renderer handles display indentation. |

---

## Kind Values

`kind` is used on both `Page` and `Member` objects. It controls the badge displayed next to the title and enables/disables certain page sections.

| Value | Badge | Sections enabled |
|-------|-------|-----------------|
| `"guide"` | (none) | Content from `guides/{id}.md` |
| `"function"` | Blue — fn | Parameters, Returns, Throws, Examples |
| `"class"` | Orange — class | Constructor, Properties, Members, Examples |
| `"interface"` | Green — interface | Properties, Examples |
| `"type"` | Purple — type | `type` field rendered inline, Examples |
| `"variable"` | Yellow — var | Description, `type`, Examples |
| `"method"` | Blue — fn | Parameters, Returns, Throws, Examples (same as function) |
| `"property"` | Purple — type | Description, `type` |
| `"enum"` | Green — interface | Properties (as enum members), Examples |
| `"namespace"` | (none) | Members |

**Rules:**
- Always set `kind`. A page without `kind` renders no badge and the renderer cannot infer which sections are relevant.
- Use `"guide"` for all developer-written narrative pages (introduction, quickstart, migration, changelog). A corresponding `.md` file in `guides/` is required.
- Use `"class"` whenever the page describes something that is instantiated with a constructor, even if the language doesn't use the `class` keyword (e.g. Go structs, Python classes).
- Use `"function"` for functions, hooks, and standalone procedures.
- Use `"interface"` for TypeScript interfaces, Go interfaces, and Python protocols/abstract classes.
- Use `"type"` for type aliases, union types, and type definitions that are not classes.
- Use `"method"` only on `Member` objects inside a class page, not on top-level pages.

---

## Supported Languages

The syntax highlighter recognises these values for `Example.language`:

| Value | Language |
|-------|----------|
| `typescript` | TypeScript |
| `tsx` | TypeScript + JSX |
| `javascript` | JavaScript |
| `jsx` | JavaScript + JSX |
| `python` | Python |
| `go` | Go |
| `java` | Java |
| `kotlin` | Kotlin |
| `swift` | Swift |
| `php` | PHP |
| `bash` | Shell / CLI |
| `json` | JSON |
| `yaml` | YAML |
| `text` | Plain text (no highlighting) |

Any unrecognised value falls back to plain text — no error, just no colours.

---

## Complete Examples

### Guide Page (stub in JSON + separate `.md` file)

**In `v2.json`:**
```json
"navigation": [
  {
    "section": "Getting Started",
    "items": [
      { "id": "introduction", "title": "Introduction", "kind": "guide" },
      { "id": "quickstart",   "title": "Quickstart",   "kind": "guide" }
    ]
  }
],
"pages": {
  "introduction": {
    "title": "Introduction",
    "kind": "guide"
  },
  "quickstart": {
    "title": "Quickstart",
    "kind": "guide"
  }
}
```

**In `guides/introduction.md`** (written by the developer, plain Markdown):
```markdown
## What is auth0-react?

auth0-react is a React library that makes it easy to add authentication
to your application using Auth0.

## Installation

```bash
npm install @auth0/auth0-react
```

## Requirements

- React 17 or higher
- Node.js 18 or higher
```

---

### Function Page

Suitable for: standalone functions, React hooks, utility methods.

```json
{
  "id": "get-access-token-silently",
  "title": "getAccessTokenSilently",
  "kind": "function",
  "description": "Retrieves an access token silently using a hidden iframe or refresh token. Falls back to an interactive login if no valid session exists.",
  "signature": "getAccessTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>",
  "parameters": [
    {
      "name": "options",
      "type": "GetTokenSilentlyOptions",
      "optional": true,
      "description": "Options controlling scopes, audience, and caching behaviour."
    }
  ],
  "returns": {
    "type": "Promise<string>",
    "description": "Resolves to a valid access token string."
  },
  "throws": [
    {
      "name": "MissingRefreshTokenError",
      "type": "MissingRefreshTokenError",
      "description": "Thrown when refresh token rotation is enabled but no refresh token is stored."
    },
    {
      "name": "TimeoutError",
      "type": "TimeoutError",
      "description": "Thrown when the silent auth iframe times out."
    }
  ],
  "examples": [
    {
      "title": "Basic usage",
      "language": "typescript",
      "code": "const { getAccessTokenSilently } = useAuth0();\n\nconst token = await getAccessTokenSilently();"
    },
    {
      "title": "With custom audience",
      "language": "typescript",
      "code": "const token = await getAccessTokenSilently({\n  authorizationParams: {\n    audience: 'https://api.example.com',\n    scope: 'read:data write:data'\n  }\n});"
    }
  ]
}
```

---

### Class Page

Suitable for: classes, client objects, managers, services.

```json
{
  "id": "management-client",
  "title": "ManagementClient",
  "kind": "class",
  "description": "Client for the Auth0 Management API. Use this to manage users, connections, applications, and other tenant resources.",
  "constructor": {
    "signature": "new ManagementClient(options: ManagementClientOptions)",
    "parameters": [
      {
        "name": "domain",
        "type": "string",
        "optional": false,
        "description": "Your Auth0 tenant domain (e.g. `your-tenant.auth0.com`)."
      },
      {
        "name": "token",
        "type": "string",
        "optional": false,
        "description": "A Management API access token with the required scopes."
      },
      {
        "name": "timeout",
        "type": "number",
        "optional": true,
        "default": "10000",
        "description": "Request timeout in milliseconds."
      }
    ]
  },
  "members": [
    {
      "id": "get-user",
      "title": "getUser",
      "kind": "method",
      "signature": "getUser(params: GetUserParams): Promise<User>",
      "description": "Fetches a single user by their Auth0 user ID.",
      "parameters": [
        {
          "name": "params.id",
          "type": "string",
          "optional": false,
          "description": "The Auth0 user ID (e.g. `auth0|6489...`)."
        }
      ],
      "returns": {
        "type": "Promise<User>",
        "description": "The full user profile."
      },
      "throws": [
        {
          "name": "ManagementApiError",
          "type": "ManagementApiError",
          "description": "Thrown when the API returns a non-2xx status. Check `error.statusCode` and `error.message`."
        }
      ],
      "examples": [
        {
          "title": "",
          "language": "typescript",
          "code": "const user = await management.getUser({ id: 'auth0|6489abc' });\nconsole.log(user.email);"
        }
      ]
    }
  ],
  "examples": [
    {
      "title": "Initialise the client",
      "language": "typescript",
      "code": "import { ManagementClient } from 'auth0';\n\nconst management = new ManagementClient({\n  domain: 'YOUR_AUTH0_DOMAIN',\n  token: 'YOUR_MANAGEMENT_TOKEN'\n});"
    }
  ]
}
```

---

### Interface / Type Page

Suitable for: TypeScript interfaces, Go interfaces, option structs, configuration types.

```json
{
  "id": "auth-client-options",
  "title": "AuthClientOptions",
  "kind": "interface",
  "description": "Configuration options passed to `AuthClient` at construction time.",
  "properties": [
    {
      "name": "domain",
      "type": "string",
      "description": "Your Auth0 tenant domain (e.g. `your-tenant.auth0.com`)."
    },
    {
      "name": "clientId",
      "type": "string",
      "description": "Your application's client ID, obtained from the Auth0 Dashboard."
    },
    {
      "name": "clientSecret",
      "type": "string | undefined",
      "description": "Your application's client secret. Required for confidential applications."
    }
  ]
}
```

---

### Type Alias Page

Suitable for: TypeScript union types, string literals, enums expressed as types.

```json
{
  "id": "token-endpoint-auth-method",
  "title": "TokenEndpointAuthMethod",
  "kind": "type",
  "description": "The authentication method used when calling the token endpoint.",
  "type": "'none' | 'client_secret_basic' | 'client_secret_post'",
  "examples": [
    {
      "title": "",
      "language": "typescript",
      "code": "const options: AuthClientOptions = {\n  tokenEndpointAuthMethod: 'client_secret_post'\n};"
    }
  ]
}
```

---

## Navigation and Pages Must Stay in Sync

Every `id` in `navigation` must have a matching key in `pages`. The generator does not validate this — a missing page produces an MDX file that imports undefined data and will render a blank page.

For guide pages, the `id` must also match a file in `guides/`. `"id": "introduction"` requires `guides/introduction.md` to exist.

**Correct:**
```json
"navigation": [
  { "section": "Client", "items": [{ "id": "auth-client", "title": "AuthClient" }] }
],
"pages": {
  "auth-client": { "id": "auth-client", "title": "AuthClient", "kind": "class", ... }
}
```

**Incorrect — `pages` key is misspelled:**
```json
"navigation": [
  { "section": "Client", "items": [{ "id": "auth-client", "title": "AuthClient" }] }
],
"pages": {
  "authClient": { ... }   ← wrong key, will not render
}
```

---

## Quality Guidelines

These directly affect the rendered page quality. Low-quality fields produce low-quality docs.

### Descriptions

- Write in full sentences. "Fetches a user." is better than "fetch user".
- Lead with the verb: "Retrieves", "Creates", "Deletes", "Returns".
- Do not repeat the function name in the description. `getUser — Gets the user.` is noise.
- For parameters, describe what the value represents and any constraints. `"The user ID"` is weak. `"The Auth0 user ID in the format auth0|{id}."` is useful.
- Keep the first sentence under 160 characters — it becomes the SEO meta description.

### Signatures

- Copy exactly from source. Do not paraphrase.
- Include full type annotations, not just names.
- For overloaded functions, include the most general overload (or the one developers will use most).
- For Go, include the full function path: `func (m *Management) GetUser(ctx context.Context, id string) (*User, error)`.

### Examples

- Every page should have at least one example. Pages without examples are much less useful.
- Examples must be complete enough to copy-paste. Import statements should be included on the first/primary example.
- Use real-looking values, not `"foo"` or `"bar"`. Prefer `"auth0|6489abc123"` over `"userId"`.
- Use `YOUR_AUTH0_DOMAIN`, `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET` as placeholder strings — these match the convention across all Auth0 documentation.
- When a page has multiple examples, each must have a distinct `title` — this becomes the tab label.

### Members on Class Pages

- List members in order of importance, not alphabetically. The most commonly used methods should come first.
- Every public method that a developer would call should be a member. Internal helpers should be excluded.
- Each member should have its own example where the usage is not obvious from the signature alone.

### Properties

- List required properties before optional ones.
- Use the type exactly as it appears in the source — do not simplify `Record<string, unknown>` to `object`.

---

## Minimal Valid File

If you are generating docs for the first time and want to ship something quickly, this is the minimum required structure:

```json
{
  "meta": {
    "status": "active"
  },
  "navigation": [
    {
      "section": "Overview",
      "items": [
        { "id": "getting-started", "title": "Getting Started" }
      ]
    }
  ],
  "pages": {
    "getting-started": {
      "id": "getting-started",
      "title": "Getting Started",
      "kind": "function",
      "description": "A brief description of this SDK.",
      "examples": [
        {
          "title": "",
          "language": "typescript",
          "code": "// Installation and basic usage example here"
        }
      ]
    }
  }
}
```

This generates one page, one sidebar section, and all navigation correctly. Expand from here.
