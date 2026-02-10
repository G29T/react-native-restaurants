# React Native Restaurants App

## Introduction

**Restaurants App** is a React Native app designed to explore restaurants around the world in an interactive and user-friendly way. The app combines **offline-first caching, dynamic theming, interactive globe visualisation, and filtering** to provide a smooth experience even when connectivity is limited.
By selecting a country label on the globe, users are redirected to the list of restaurants for that country. Alternatively, they can navigate to the restaurant list using the View List button.

Key features include:

- **Offline caching**: Restaurant data is cached using AsyncStorage so the app remains functional without an internet connection.
- **Dynamic themes**: Users can switch between light, dark, or system themes.
- **Interactive globe**: Users can tap on countries on a 3D globe.
- **Restaurant list navigation**: A button is available to quickly navigate from the globe to a structured list of restaurants.
- **Filters**: Users can filter restaurants by continent or country using the dedicated filter UI.
- **Restaurant details**: Tapping a restaurant card in the list opens its website directly.

**Note:**

The code may seem unusual at first glance. Currently, the external data source used for the GET requests only contains UK restaurants. If the data source were to expand and return restaurants grouped by country, the data-handling logic would need to be adjusted accordingly. This approach was chosen primarily to make the app more fun and interactive while demonstrating scalable patterns.

The architecture emphasises maintainability, clarity, and predictable state flow.

- Screenshots of the app in different states are included below.

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Step 1: Start Metro

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Build and run your app

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

### Step 3: Run tests

#### Run Jest tests

```sh
# Using npm
npm test

# OR using Yarn
yarn test
```

#### Run Maestro E2E tests

```sh
# Using npm
npm e2e

# OR using Yarn
yarn e2e
```

## Main Tech Stack

- **React Native**
- **TypeScript**
- **React Navigation**
- **Context API**
- **Native Fetch API**
- **AsyncStorage**
- **React Native WebView**
- **Jest**
- **Maestro**

## Project Structure

- **`app/providers.tsx`** Centralises all app-level providers.

- **`core/`** Contains app-wide infrastructure such as api, navigation, network, theming, and provider composition.

- **`features/`** Groups code by business domain (restaurants, home, settings), with each feature owning its screens, components, hooks, and types.

- **`shared/`** Holds reusable components and utilities that can be safely used across features.

- **`types/`** Contains shared TypeScript types that don't belong to a single feature.

## Function declarations vs arrow functions for components

This codebase intentionally uses **both function declarations and arrow functions**, depending on the role of the component or function.

**Function declarations are preferred for:**

- Larger, screen-level components
- Providers
- Public utilities exported from a module

**Arrow functions are preferred for:**

- Smaller, reusable UI components
- Small utility functions
- Hooks helpers
- Event handlers
- Inline callbacks
- Functions stored in variables

## Implementation

### Design Philosophy

The app is built around a few core principles:

- **Predictability**  
   Logic is explicit and traceable. State transitions are easy to reason about and debug.
- **Separation of concerns**  
   Network state, theme state, navigation, data fetching, and UI rendering are clearly isolated.
- **Offline-first mindset**  
   The app behaves sensibly without connectivity and recovers gracefully when the network returns.
- **Testability by design**  
   Deterministic overrides, dependency boundaries, and stable test IDs were included from the beginning.
- **Accessibility**  
   Accessibility is part of the implementation.

### Navigation & App Shell

#### Root Navigator

The `NavigationContainer` is configured with a theme derived directly from the app's design system:

```ts
<NavigationContainer theme={navTheme} />
```

The navigation theme uses the same color system as the rest of the UI, preventing mismatches between headers, cards, and system UI. When the theme changes, navigation styling updates automatically.

**Key decisions:**

- `useMemo` prevents unnecessary recreation of theme objects
- Header styles are centralised via `screenOptions`
- Visual consistency is enforced across the app

### Provider Architecture

```tsx
<ThemeProvider>
  <GestureHandlerRootView>
    <SafeAreaProvider>
      <NetworkProvider>{children}</NetworkProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
</ThemeProvider>
```

Providers are ordered by **cross-cutting concern priority**:

Each provider is:

- Single-purpose
- Self-contained
- Consumed safely via hooks (`useTheme`, `useNetworkInfo`)

### Theme System

#### Goals

- Support **system**, **light**, and **dark** modes
- Persist user preference
- Avoid startup flicker
- Centralise and strongly type color usage

#### Implementation

Users can select `system`, `light`, or `dark`. Internally, this choice is resolved into a concrete theme (`light` or `dark`) at runtime.

- **System theme** follows the OS appearance and updates automatically when the system theme changes
- User preference is preserved and not overwritten by OS changes

Theme persistence is asynchronous, which introduces a risk of UI flicker during startup. To prevent this, the `ThemeProvider` exposes an `isThemeLoaded` flag so the app delays rendering until the correct theme is known.

Colors are centralised through `getColors(theme)`. Components never hardcode color values or conditional logic. They receive a resolved palette, which keeps components simple and prevents inconsistent styling.

### Network Awareness

#### NetworkProvider

Network connectivity is treated as a first-class concern. The provider tracks both:

- `isDeviceOnline` — current connectivity
- `wasDeviceOffline` — detects offline → online recovery

```ts
if (prev === false && now === true) {
  setWasDeviceOffline(true);
}
```

Tracking both enables better UX decisions, such as showing a "back online" banner only when reconnection occurs, rather than repeatedly while online.

**This enables:**

- "You're back online" banners
- Conditional refetching
- Avoiding redundant error messaging

#### Testability

```ts
forceNetworkStatus(true | false | null);
```

This deliberate override allows deterministic testing of online and offline states without mocking native NetInfo or relying on unreliable device-level toggles.
It has zero production impact and was designed specifically for testability.

### Data Fetching & Offline Caching

### `useRestaurants` Hook

The restaurant data flow is designed around real-world constraints: unreliable networks, failing APIs, and user expectations of continuity.

Responsibilities:

- Fetch restaurant data
- Cache responses with a TTL
- Serve cached data when offline
- Expose loading, error, and offline states

Caching is time-based:

```ts
const isCacheExpired = Date.now() - cached.timestamp > CACHE_TTL;
```

**Key behaviors:**

- Cached data is used when offline or still valid
- Fresh data is fetched only when necessary
- When offline, stale data is preferred over empty screens

This approach is simple, debuggable, and sufficient for this scenario.

### AsyncStorage

**AsyncStorage** is suitable for the current scenario because the restaurant data is relatively small, and changes infrequently, making lightweight key–value storage a good fit. It allows data to persist across app launches and enables offline access without adding unnecessary complexity.

This choice should be reconsidered if the dataset grows significantly, requires partial updates, complex querying, or frequent writes. In those cases, a more robust solution would be more appropriate.

### HomeScreen: Role & Behavior

The `HomeScreen` acts as the app's visual entry point and interaction hub. It combines theming, navigation, network awareness, and a heavy visual component (the globe) in a controlled and predictable way.

```ts
const { isDeviceOnline, wasDeviceOffline } = useNetworkInfo();
```

Network state is read once and drives multiple UI decisions, including whether the globe renders and which banners or fallback messages are shown.

#### Offline Behavior (Globe)

When the device is offline, the globe is intentionally **not accessible** due to its WebView-based implementation.

Instead, the UI displays:

- An offline banner informing the user of connectivity loss
- A clear message explaining that the globe is unavailable offline
- Guidance to navigate to the restaurant list using the **"View List"** button in the top-right corner

When the device transitions from offline to online, a temporary banner informs the user that connectivity has been restored and the globe is usable again.

This makes state transitions explicit and avoids broken or confusing interactions.

### Globe

#### Lifecycle & Reloading

The globe is intentionally reloaded whenever the screen gains focus while online:

```ts
useFocusEffect(
  useCallback(() => {
    if (!isDeviceOnline) return;
    setGlobeLoading(true);
    setGlobeRenderToken(prev => prev + 1);
  }, [isDeviceOnline]),
);
```

This ensures:

- The globe does not resume in a stale or zoomed state
- WebView memory and animation state reset cleanly
- Returning from another screen always starts fresh (not oddly zoomed)

The `renderToken` is used as a `key` on the WebView, forcing a full remount instead of relying on opaque internal WebView state.

#### WebView-Based Globe

The globe is implemented using a `WebView`:

```tsx
<WebView key={renderToken} source={{ html: globeHtml }} />
```

**Prod of WebView:**

- `three.js` and `globe.gl` are mature and battle-tested
- Avoids complex native 3D bindings
- Isolates visual complexity from the React Native tree

#### WebView - React Native Communication

Communication uses `postMessage`:

```ts
window.ReactNativeWebView.postMessage(
  JSON.stringify({ type: 'select', id, hasData }),
);
```

On the React Native side, messages are parsed and handled explicitly. This keeps the contract simple, typed, and easy to evolve.

#### HTML Generation & Theming

The globe HTML is generated dynamically:

```ts
generateGlobeHtml(theme, backgroundColor, COUNTRIES);
```

This allows theme values to be injected directly, avoids runtime DOM mutations, and ensures visual consistency between native UI and WebView content.

Country data is frozen inside the WebView to prevent accidental mutation.

### Filter System

- Stateless `FilterButton` components
- Reusable `FilterModal` for continents and countries
- Options derived via `useMemo`

Selecting a continent resets the country filter to prevent invalid combinations, while selecting a country automatically derives and updates the corresponding continent. Selecting **"All"** resets filters fully and restores the unfiltered view.

### Restaurant List

Using `SectionList` provides logical grouping, efficient rendering, and future scalability. Empty states are treated as valid outcomes, not errors. A country without restaurants does not break the layout or logic. This approach ensures the UI remains stable as data availability evolves.

The `RestaurantCard` key uses name + index, which is acceptable because the data is fetched from an external source and the user cannot delete, insert, or reorder items in the list. **This decision is documented so it can be revisited if the data model changes.**

```tsx
<RestaurantCard
  testID={`restaurant-card-${index}`}
  key={`${restaurant.name}-${index}`}
  restaurant={restaurant}
  colors={colors}
  theme={theme}
/>
```

### Accessibility & UX

- All interactive elements expose `accessibilityRole` and `accessibilityLabel`
- Modal backdrops are dismissible and screen-reader aware
- Loading, empty, and error states are explicit and readable

### Error Handling Philosophy

Errors are:

- Normalised
- Logged (currently to console for development)
- Reflected in the UI without crashing the app

In the future, internal errors can be routed to services without changing ap plication logic.

### Native Module VS JSI

After evaluating both Native Modules and JSI, a **Native Module is the more appropriate choice for fetching the app version** in this project.

The app version is read infrequently, never in tight loops, and there is no performance bottleneck to worry about. Introducing JSI would add unnecessary complexity, increase maintenance cost, and introduce potential stability risks, without providing any tangible benefit.
Native Modules are a better fit for the current scenario because they are simple, reliable, and sufficient for low-frequency operations. The asynchronous nature of Native Modules is not a concern, as the delay is negligible and unnoticeable in the UI. JSI, while faster and synchronous, is designed for scenarios where JavaScript must interact with native code at very high frequency, which does not apply to reading a static app version.

In this project, using a Native Module results in cleaner code, lower implementation and maintenance cost, and a more robust solution overall. JSI would only be justified if the app version were accessed extremely frequently or if it were part of a performance-critical execution, which is not the case here.

### iOS CI Setup Without Local Mac

Set up **GitHub Actions** to build iOS on macOS runners. The workflow checks out the repo, installs dependencies with Yarn, sets up CocoaPods, builds the app for the iOS simulator, and runs Jest tests via .github\workflows\ios-build.yml

### Testing Strategy

**Important:** There are two sections in the `HomeScreen` component that are currently commented out. These should be uncommented when running E2E Maestro tests; otherwise, the tests will fail. They provide functionalities necessary for E2E testing.

#### Jest

Jest is used to test every meaningful component, hook, and utility in isolation.

Some focus areas:

- Loading, error, empty, online, and offline states
- Navigation behavior
- Timers, subscriptions, and cleanup
- Accessibility attributes
- Mocking network, theme, WebView, and native APIs

#### Maestro (E2E)

Maestro validates real user flows against real builds.

E2E tests can be flaky because rendering and async operations depend on factors like network, device performance, and JS thread timing. Even with the same code, UI updates can shift by milliseconds, causing occasional test failures. This is expected behavior, not a bug.

Validated flows include:

- Online flow
- Offline flow
- Online to offline to online recovery
- Filtering
- Navigation reliability
- Theme selection

E2E tests are not included in CI builds because they can be slow and sometimes flaky due to async operations, network timing differences. Keeping them out of automated CI ensures fast, reliable builds while still allowing developers to run them manually for full app verification.

### UI Images

![Home Screen - Online](<Light 1.png>)
![Home Screen - Online](<Light  2.png>)
![Settings Screen](<Light 3.png>)
![Restaurants Screen - Online](<Light  4.png>)
![Country Modal](<Light 5.png>)
![Continent Modal](<Light  6.png>)
![Filtered Restaurants](<Light  7.png>)
![Home Screen - Offline](<Light  8.png>)
![Restaurants Screen - Offline](<Light  9.png>)
![Restaurants visible when offline](<Light 10.png>)
![Filtered Restaurants - Offline](<Light  11.png>)
![Back online banner](<Light 12.png>)

![Home Screen - Online](<Dark 1.png>)
![Settings Screen](<Dark 2.png>)
![Restaurants Screen - Online](<Dark 3.png>)
![Restaurants Screen - Online](<Dark  4.png>)
![Continent Modal](<Dark 5.png>)
![Country Modal](<Dark  6.png>)
![Filtered Restaurants](<Dark 7.png>)
![Filtered Restaurants](<Dark 8.png>)
![Home Screen - Offline](<Dark  9.png>)
![Restaurants Screen - Offline](<Dark  10.png>)
![Filtered Restaurants - Offline](<Dark 11.png>)
