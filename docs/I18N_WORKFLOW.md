# Internationalization (i18n) Workflow

This document explains how to manage translations in the Notakto project.

## Overview

The project uses `next-intl` for internationalization and supports 8 languages:
- English (en) - **Master language**
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Japanese (ja)
- Hindi (hi)
- Portuguese (pt)

All translation files are located in the `messages/` directory.

## Adding New Translations

### Step 1: Add to English (Master)

When you need to add a new translation:

1. **Add the key to `messages/en.json`** (the master file)
   ```json
   {
     "Game": {
       "new_feature": "New Feature"
     }
   }
   ```

2. **Use it in your component:**
   ```tsx
   const t = useTranslations("Game");
   return <div>{t("new_feature")}</div>;
   ```

### Step 2: Sync to All Languages

Run the sync script to automatically add the new key to all language files:

```bash
pnpm i18n:sync
```

This will:
- ✅ Add missing keys to all language files (using English as placeholder)
- ✅ Remove obsolete keys that no longer exist in English
- ✅ Keep all files in sync

### Step 3: Translate the New Keys

After syncing, you'll need to manually translate the new keys in each language file:

1. Open `messages/es.json` (or any other language)
2. Find the new key (it will have the English text as placeholder)
3. Replace it with the proper translation

**Example:**
```json
// Before sync (missing key)
{
  "Game": {
    "settings": "Configuración"
  }
}

// After sync (auto-added with English placeholder)
{
  "Game": {
    "settings": "Configuración",
    "new_feature": "New Feature"  // ← Needs translation
  }
}

// After translation
{
  "Game": {
    "settings": "Configuración",
    "new_feature": "Nueva Característica"  // ← Translated
  }
}
```

## Removing Translations

### Step 1: Remove from English

Remove the key from `messages/en.json`:

```json
{
  "Game": {
    // "old_feature": "Old Feature" ← Remove this
  }
}
```

### Step 2: Sync to Remove from All Languages

Run the sync script:

```bash
pnpm i18n:sync
```

This will automatically remove the obsolete key from all language files.

## Checking Translation Status

To check if all translation files are in sync **without modifying them**:

```bash
pnpm i18n:check
```

This will:
- ✅ Report missing keys in each language
- ✅ Report extra keys (not in English)
- ✅ Exit with error code if issues found
- ❌ **Does NOT modify any files**

## Best Practices

1. **Always add new keys to English first** - English is the master language
2. **Run `pnpm i18n:sync` after adding/removing keys** - Keeps all files in sync
3. **Translate new keys promptly** - Don't leave English placeholders in production
4. **Use descriptive key names** - `player_turn` is better than `pt`
5. **Group related keys** - Use nested objects like `Game.settings`, `Game.reset`
6. **Check before committing** - Run `pnpm i18n:check` to ensure everything is synced

## Translation File Structure

Translation files use nested JSON objects:

```json
{
  "Menu": {
    "title": "Notakto",
    "play_vs_player": "Play vs Player"
  },
  "Game": {
    "settings": "Settings",
    "reset": "Reset"
  }
}
```

Access in components:
```tsx
const t = useTranslations("Menu");
t("title"); // "Notakto"
t("play_vs_player"); // "Play vs Player"
```

## Troubleshooting

### Missing translations showing as keys

If you see keys like `Menu.title` instead of translated text:
1. Check that the key exists in `messages/en.json`
2. Run `pnpm i18n:sync` to ensure all files have the key
3. Verify the locale is correct in the URL (`/en/`, `/es/`, etc.)

### Translation not updating

1. Clear browser cache
2. Restart the dev server
3. Check that the locale in the URL matches the file you edited

### Sync script errors

If the sync script fails:
1. Ensure all `messages/*.json` files are valid JSON
2. Check that `messages/en.json` exists and is valid
3. Verify you have write permissions to the `messages/` directory

## CI/CD Integration

You can add the check to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Check translations
  run: pnpm i18n:check
```

This ensures all translation files stay in sync before merging PRs.

