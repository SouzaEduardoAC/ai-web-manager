# Lead Architect Strategy Document: Color Identity Migration to 'The Oak'

## 1. Executive Summary
**Objective:** Transition the current visual identity from "MCP Orchestrator" (Blue/Dark) to "The Oak" (Nature-inspired/Earthy) branding based on the [TheOakOrganization/Oak](https://github.com/TheOakOrganization/Oak) identity.
**Definition of Done:**
- `tailwind.config.js` redefined with "Oak" color tokens.
- All `src/` components updated to use new color classes.
- UI elements (App Bar, Chat, Registry) reflect the Forest Green/Brown/Amber palette.
- Documentation synced with the "The Oak" project identity.

## 2. Current State Analysis
- **Theme Engine:** Tailwind CSS v3 with a custom `mcp` object in the config.
- **Color Usage:** 50+ instances of `mcp-` tokens found across `App.vue`, `ChatWindow.vue`, `McpHealthDashboard.vue`, `TransportForm.vue`, and `ToolApprovalQueue.vue`.
- **Primary Contrast:** Currently using `mcp-blue` (#60a5fa) as the primary action color.
- **Branding:** Title recently changed to "The Oak", but visual tokens are still tied to the legacy identity.

## 3. Step-by-Step Strategic Roadmap

### Phase 1: Token Redefinition
1.  **Map New Palette:**
    - `oak-primary`: `#224b0c` (Forest Green) -> Replaces `mcp-blue` for primary actions.
    - `oak-secondary`: `#6f4e37` (Earthy Brown) -> Used for secondary elements.
    - `oak-accent`: `#b8860b` (Warm Amber) -> Replaces `mcp-yellow` for warnings/approvals.
    - `oak-status-green`: `#4ade80` -> Replaces `mcp-green` for healthy states.
    - `oak-status-red`: `#f87171` -> Replaces `mcp-red` for error states.
2.  **Update `tailwind.config.js`:** Replace the `mcp` block with `oak`.

### Phase 2: Systematic Refactoring
1.  **Automated Class Migration:** Execute a global search-and-replace for color tokens:
    - `bg-mcp-blue` -> `bg-oak-primary`
    - `text-mcp-blue` -> `text-oak-primary`
    - `border-mcp-yellow` -> `border-oak-accent`
    - etc.
2.  **Component Specific Adjustments:**
    - **ChatWindow.vue:** Update "Thinking" bounce animation to use `oak-primary`.
    - **ToolApprovalQueue.vue:** Update "Tool Request" header to use `oak-accent`.
    - **McpHealthDashboard.vue:** Update health icons to new status tokens.

### Phase 3: Context & Metadata
1.  **Documentation Update:** Update `docs/technical_documentation.md` and `docs/ai_context.md` to strictly use "The Oak" terminology and "Oak Theme" descriptions.
2.  **Manifest Update:** Update `index.html` meta tags to match the new identity.

## 4. Verification & Testing Plan
- **Build Pass:** `npm run build` must complete without errors.
- **CSS Audit:** Verify `dist/assets/*.css` contains no occurrences of the string `mcp-`.
- **Legibility Check:** Confirm white/cream text is readable on the new `#224b0c` green backgrounds.
- **Edge Case:** Check the "Disconnected" state in `App.vue` to ensure the red pulse still works with the new `oak-status-red`.

## 5. Risk Assessment
- **Breaking Changes:** The transition is purely visual but requires a clean build. 
- **Inconsistency:** If the `tailwind.config.js` is updated before the components, the dev server will show unstyled elements (transparent/default) until migration is complete.
- **Logo Clash:** The existing logo has teal/navy tones; it may require a hue rotation or replacement to match the new forest green identity.
