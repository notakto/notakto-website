#!/usr/bin/env node
/**
 * Translation Sync Script
 * 
 * This script helps manage translations across all language files:
 * 1. Validates all files have the same keys
 * 2. Adds missing keys to all language files (using English as template)
 * 3. Removes obsolete keys from all language files
 * 4. Reports missing translations
 * 
 * Usage:
 *   pnpm i18n:sync          # Check and sync all translations
 *   pnpm i18n:check         # Only check, don't modify files
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOCALES = ["en", "es", "fr", "de", "zh", "ja", "hi", "pt"];
const MESSAGES_DIR = join(__dirname, "..", "messages");

function getNestedKeys(obj, prefix = "") {
	const keys = [];
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			keys.push(...getNestedKeys(value, fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}

function setNestedValue(obj, path, value) {
	const keys = path.split(".");
	let current = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current) || typeof current[key] !== "object") {
			current[key] = {};
		}
		current = current[key];
	}
	current[keys[keys.length - 1]] = value;
}

function getNestedValue(obj, path) {
	const keys = path.split(".");
	let current = obj;
	for (const key of keys) {
		if (current && typeof current === "object" && key in current) {
			current = current[key];
		} else {
			return undefined;
		}
	}
	return current;
}

function loadTranslations(locale) {
	const filePath = join(MESSAGES_DIR, `${locale}.json`);
	if (!existsSync(filePath)) {
		console.error(`❌ File not found: ${filePath}`);
		process.exit(1);
	}
	try {
		const content = readFileSync(filePath, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error(`❌ Error reading ${filePath}:`, error);
		process.exit(1);
	}
}

function saveTranslations(locale, data) {
	const filePath = join(MESSAGES_DIR, `${locale}.json`);
	const content = JSON.stringify(data, null, "\t");
	writeFileSync(filePath, content, "utf-8");
}

function sortObjectKeys(obj) {
	const sorted = {};
	const keys = Object.keys(obj).sort();
	for (const key of keys) {
		if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
			sorted[key] = sortObjectKeys(obj[key]);
		} else {
			sorted[key] = obj[key];
		}
	}
	return sorted;
}

function syncTranslations(checkOnly = false) {
	console.log("🌐 Translation Sync Tool\n");

	// Load all translation files
	const translations = {};
	for (const locale of LOCALES) {
		translations[locale] = loadTranslations(locale);
	}

	// Get all keys from English (master)
	const masterKeys = getNestedKeys(translations.en);
	console.log(`📋 Found ${masterKeys.length} translation keys in English\n`);

	// Check each language file
	let hasChanges = false;

	for (const locale of LOCALES) {
		if (locale === "en") continue; // Skip English

		const localeKeys = getNestedKeys(translations[locale]);
		const missing = masterKeys.filter((key) => !localeKeys.includes(key));
		const extra = localeKeys.filter((key) => !masterKeys.includes(key));

		if (missing.length > 0 || extra.length > 0) {
			hasChanges = true;

			console.log(`\n📝 ${locale.toUpperCase()}:`);
			if (missing.length > 0) {
				console.log(`   ⚠️  Missing ${missing.length} keys:`);
				missing.slice(0, 10).forEach((key) => {
					console.log(`      - ${key}`);
				});
				if (missing.length > 10) {
					console.log(`      ... and ${missing.length - 10} more`);
				}

				// Add missing keys
				if (!checkOnly) {
					for (const key of missing) {
						const englishValue = getNestedValue(translations.en, key);
						// Use English value as placeholder, or empty string
						const placeholder = englishValue || `[TODO: Translate ${key}]`;
						setNestedValue(translations[locale], key, placeholder);
					}
					// Sort and save
					translations[locale] = sortObjectKeys(translations[locale]);
					saveTranslations(locale, translations[locale]);
					console.log(`   ✅ Added ${missing.length} missing keys`);
				}
			}

			if (extra.length > 0) {
				console.log(`   🗑️  Extra ${extra.length} keys (not in English):`);
				extra.slice(0, 10).forEach((key) => {
					console.log(`      - ${key}`);
				});
				if (extra.length > 10) {
					console.log(`      ... and ${extra.length - 10} more`);
				}

				// Remove extra keys
				if (!checkOnly) {
					for (const key of extra) {
						const keys = key.split(".");
						let current = translations[locale];
						for (let i = 0; i < keys.length - 1; i++) {
							current = current[keys[i]];
						}
						delete current[keys[keys.length - 1]];
					}
					// Clean up empty objects
					translations[locale] = sortObjectKeys(translations[locale]);
					saveTranslations(locale, translations[locale]);
					console.log(`   ✅ Removed ${extra.length} extra keys`);
				}
			}
		} else {
			console.log(`✅ ${locale.toUpperCase()}: All keys synced`);
		}
	}

	if (!hasChanges) {
		console.log("\n✨ All translation files are in sync!");
	} else if (checkOnly) {
		console.log("\n⚠️  Issues found. Run 'pnpm i18n:sync' to fix them.");
		process.exit(1);
	} else {
		console.log("\n✨ Translation sync complete!");
	}
}

// Main execution
const args = process.argv.slice(2);
const checkOnly = args.includes("--check") || args.includes("-c");

syncTranslations(checkOnly);

