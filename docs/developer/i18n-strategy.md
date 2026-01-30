# Internationalization (i18n) Strategy with Lingui.js

This project uses **Lingui.js** for internationalization with RTL support.

## Current Setup

- **Library:** Lingui.js
- **Locales:** English (en), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), Traditional Chinese (zh-TW) with RTL support
- **Language switching:** Runtime locale detection and activation
- **RTL Support:** Automatic `dir` and `lang` attribute updates on HTML element

## Why Lingui.js?

### Advantages

- **Compile-time translations** - Extract strings at build time
- **SWC compiler** - Faster processing of translations
- **Type-safe keys** - No runtime string typos with message descriptors
- **Plural ICU format** - Built-in robust pluralization rules
- **Macro system** - Integrates seamlessly with build tools for efficient translation extraction
- **Active community** - Strong support and development

## Configuration

**File:** `src/i18n/config.ts`

```typescript
import { i18n } from '@lingui/core'
import { messages as enMessages } from '@/locales/en/messages'
import { messages as jaMessages } from '@/locales/ja/messages'
import { messages as koMessages } from '@/locales/ko/messages'
import { messages as zhCNMessages } from '@/locales/zh-CN/messages'
import { messages as zhTWMessages } from '@/locales/zh-TW/messages'
import { en, ja, ko, zhCN, zhTW } from 'make-plural/plurals'

// Load plural rules for each language
i18n.loadLocaleData({
  en: { plurals: en },
  ja: { plurals: ja },
  ko: { plurals: ko },
  'zh-CN': { plurals: zhCN },
  'zh-TW': { plurals: zhTW },
})

// Load messages for each language
i18n.load({
  en: enMessages,
  ja: jaMessages,
  ko: koMessages,
  'zh-CN': zhCNMessages,
  'zh-TW': zhTWMessages,
})

// Activate default locale
i18n.activate(localStorage.getItem('locale') || 'en')
```

## Usage

### React Components

```tsx
import { useLingui } from '@lingui/react'
import { msg } from '@lingui/core/macro'

function MyComponent() {
  const { i18n } = useLingui()
  return <h1>{i18n._(msg`myFeature.title`)}</h1>
}
```

### Non-React Contexts

```typescript
import { i18n } from '@/i18n/config'
import { msg } from '@lingui/core/macro'

const t = i18n._.bind(i18n)
console.log(t(msg`someKey`))
```

## RTL Support

Arabic locale (ar) automatically:

- Sets `dir="rtl"` on HTML element
- Updates CSS logical properties support via Tailwind
- Flips layout direction


## Recommendations

**Lingui.js is recommended for projects that need:**

- ✅ Compile-time translation extraction
- ✅ Type safety for translation keys
- ✅ Robust pluralization with ICU format
- ✅ Optimized build performance with SWC compiler integration
- ✅ Mature ecosystem with active community support
## References

- [Lingui Documentation](https://lingui.dev)