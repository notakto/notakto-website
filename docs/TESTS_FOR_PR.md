# Testing Guidelines for Pull Requests

When contributing to this project, ensuring code reliability through testing is crucial. This document outlines the requirements and process for adding tests when raising a Pull Request (PR).

## When to Add Tests

You **must** include tests for your changes unless your PR falls into one of the following categories:
- **Docs**: Pure documentation updates (e.g., README changes, comment additions).
- **Refactoring**: Code restructuring without altering behavior (e.g., renaming variables, reorganizing modules).

For all other PR types (e.g., new features, bug fixes, enhancements), follow the process below to add or update tests.

## How to Add Tests

Tests are managed using Excel spreadsheets (XLSX files) in the `tests/` folder. Each feature or module has its own dedicated XLSX file for test cases. This allows for organized, spreadsheet-based test planning and execution.

### Step-by-Step Process

1. **Navigate to the Tests Folder**:
   - Go to the `tests/` directory in the project root.

2. **Locate or Create the Relevant XLSX Sheet**:
   - Look for an existing XLSX file corresponding to your feature or module (e.g., `user_authentication_tests.xlsx` for user authentication features).
   - Sheets are organized by feature, with one XLSX per major feature/folder.
   - If no relevant XLSX exists:
     - Create a new one named descriptively (e.g., `new_feature_tests.xlsx`).
     - Place it in a subfolder within `tests/` matching your feature (e.g., `tests/new_feature/`).

3. **Examine the Format**:
   - Open an existing XLSX file in the `tests/` folder to review the sheet structure.

4. **Add New Test Entries**:
   - Append a new row for each test case.
   - Fill in all relevant columns based on your changes.
  
5. **Commit and Reference in PR**:
   - Commit the updated XLSX and any new scripts to your branch.
   - In your PR description, link to the updated test sheet and mention the test cases added (e.g., "Added TC-005 to TC-010 in `tests/feature_x/feature_x_tests.xlsx`").

## Guidelines by PR Type

### New Features
- **Comprehensive Coverage**: Plan a broad list of test cases covering edge cases, happy paths, and error scenarios. This helps future-proof the feature.
- **Prioritization**: You don't need to implement scripts for *all* cases immediately.
  - Focus on **high-priority** tests (e.g., core functionality, security-critical paths).
  - Mark lower-priority cases as "Pending" in the XLSX.
  - The rest can be implemented in follow-up PRs—your feature PR can still be merged without full coverage.

### Bug Fixes
- **Minimal but Targeted**: One well-written test case is often sufficient to verify the fix.
  - Ensure it reproduces the bug *before* the fix and passes *after*.
  - Add it to the relevant feature's XLSX sheet.
- **Example**: For a login timeout bug, add a single test for "Login with expired session" marked as High Priority.