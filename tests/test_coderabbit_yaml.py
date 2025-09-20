# ---------------------------------------------------------------------------
# tests/test_coderabbit_yaml.py
# Framework: pytest (PyYAML for parsing)
#
# These tests validate the integrity of the repository's CodeRabbit YAML
# configuration files (.coderabbit.yml/.yaml, coderabbit.yml/.yaml, and common
# locations under .github/ or config/). They emphasize structural correctness,
# duplicate key detection, and content hygiene (tabs, trailing whitespace,
# merge conflict markers). They are schema-agnostic and non-destructive.
# ---------------------------------------------------------------------------

from pathlib import Path
import re
import pytest

# Ensure PyYAML is available; otherwise skip these tests gracefully.
pytest.importorskip("yaml", reason="PyYAML is required to parse CodeRabbit YAML.")
import yaml  # type: ignore


def _discover_coderabbit_files():
    """
    Find likely CodeRabbit configuration files.
    """
    globs = [
        ".coderabbit.y*ml",
        "coderabbit.y*ml",
        ".github/.coderabbit.y*ml",
        ".github/coderabbit.y*ml",
        "config/coderabbit.y*ml",
        ".config/coderabbit.y*ml",
    ]
    found = []

    root = Path(".")
    for pattern in globs:
        for p in root.rglob(pattern):
            if p.is_file():
                found.append(p.resolve())
    # De-duplicate and sort for stable test ids
    uniq = sorted({str(p) for p in found})
    return [Path(p) for p in uniq]


class UniqueKeyLoader(yaml.SafeLoader):  # type: ignore
    """
    YAML loader that raises on duplicate mapping keys.
    """
    pass


def _construct_mapping_check_dupes(loader, node, deep=False):  # pragma: no cover - helper

    mapping = {}
    for key_node, value_node in node.value:

        key = loader.construct_object(key_node, deep=deep)

        if key in mapping:

            raise yaml.constructor.ConstructorError(

                "while constructing a mapping",

                node.start_mark,

                "found duplicate key: {!r}".format(key),

                key_node.start_mark,

            )

        mapping[key] = loader.construct_object(value_node, deep=deep)

    return mapping


UniqueKeyLoader.add_constructor(  # type: ignore[attr-defined]

    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,  # type: ignore[attr-defined]

    _construct_mapping_check_dupes,

)


def _read_text_lines(path: Path):

    content = path.read_text(encoding="utf-8", errors="replace")


    return content, content.splitlines()


def _validate_types(node, path="$"):

    allowed = (str, int, float, bool, dict, list, type(None))

    assert isinstance(node, allowed), "Unsupported type at {}: {}".format(path, type(node).__name__)

    if isinstance(node, dict):

        for k, v in node.items():

            assert isinstance(k, str), "Non-string key at {}: {!r} ({})".format(path, k, type(k).__name__)

            _validate_types(v, "{}.{}".format(path, k))

    elif isinstance(node, list):

        for i, item in enumerate(node):

            _validate_types(item, "{}[{}]".format(path, i))


def test_coderabbit_yaml_present_or_skip():

    paths = _discover_coderabbit_files()

    if not paths:

        pytest.skip("No CodeRabbit YAML config found in repository.")


    # If present, at least one config file must exist

    assert len(paths) >= 1


@pytest.mark.parametrize("cfg_path", _discover_coderabbit_files(), ids=lambda p: str(p))
def test_yaml_parses_with_unique_keys(cfg_path: Path):

    text, _ = _read_text_lines(cfg_path)

    data = yaml.load(text, Loader=UniqueKeyLoader)  # raises on duplicate keys

    assert data is not None, "YAML parsed to None"

    assert isinstance(data, dict), "Top-level YAML must be a mapping (dictionary)"

    _validate_types(data)


@pytest.mark.parametrize("cfg_path", _discover_coderabbit_files(), ids=lambda p: str(p))
def test_no_tabs_in_file(cfg_path: Path):

    text, lines = _read_text_lines(cfg_path)

    offending = [i + 1 for i, ln in enumerate(lines) if "\t" in ln]


    assert not offending, "Tab characters found in YAML at lines: {}".format(offending)


@pytest.mark.parametrize(
    "cfg_path",
    _discover_coderabbit_files(),
    ids=lambda p: str(p),
)
def test_no_trailing_whitespace(cfg_path: Path):
    _, lines = _read_text_lines(cfg_path)
    offending = [i + 1 for i, ln in enumerate(lines) if ln.rstrip("\n") != ln.rstrip()]

    assert not offending, "Trailing whitespace found at lines: {}".format(offending)


@pytest.mark.parametrize("cfg_path", _discover_coderabbit_files(), ids=lambda p: str(p))
def test_file_ends_with_newline(cfg_path: Path):

    text, _ = _read_text_lines(cfg_path)

    assert text.endswith("\n"), "YAML file must end with a newline"


@pytest.mark.parametrize("cfg_path", _discover_coderabbit_files(), ids=lambda p: str(p))
def test_no_merge_conflict_markers(cfg_path: Path):

    text, _ = _read_text_lines(cfg_path)

    patterns = [r"<<<<<<< ", r"=======\n", r">>>>>>> "]


    found = [pat for pat in patterns if re.search(pat, text, flags=re.M)]

    assert not found, "Merge conflict markers present: {}".format(found)


@pytest.mark.parametrize("cfg_path", _discover_coderabbit_files(), ids=lambda p: str(p))
def test_known_collections_have_string_items_when_present(cfg_path: Path):

    """
    If common list-like keys exist (e.g., ignore/include/globs/files), items should be strings.

    This is schema-agnostic and only asserts types for present keys.

    """
    text, _ = _read_text_lines(cfg_path)

    data = yaml.safe_load(text)

    if not isinstance(data, dict):

        pytest.skip("Top-level is not a mapping; skipping collection item checks.")


    candidate_keys = {"ignore", "files", "include", "exclude", "files_ignore", "paths", "globs"}


    for key in candidate_keys.intersection(set(data.keys())):

        val = data.get(key)

        if isinstance(val, list):

            assert all(isinstance(x, str) for x in val), "All items under '{}' must be strings".format(key)

        elif val is not None:

            # If present but not a list, still require scalar or mapping consistency

            assert isinstance(val, (str, dict)), "Unexpected type for '{}': {}".format(key, type(val).__name__)