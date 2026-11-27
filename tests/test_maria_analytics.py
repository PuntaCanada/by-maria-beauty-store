import ast
import json
import textwrap
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch
import time

source = Path(".github/workflows/maria-analytics-daily.yml").read_text()
code = textwrap.dedent(source.split("python3 - <<'PY'\n", 1)[1].rsplit("          PY", 1)[0])
tree = ast.parse(code)
ns = {"json": json, "urllib": urllib, "time": time}
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n, ast.FunctionDef)], type_ignores=[]), "<workflow>", "exec"), ns)
parse = ns["parse_stats"]
post = ns["post_json"]

def payload(groups):
    return {"data": {"viewer": {"accounts": [{"rumPageloadEventsAdaptiveGroups": groups}]}}}

def group(host="by-maria-beauty-store.pages.dev", count=7, visits=3):
    return {"dimensions": {"requestHost": host}, "count": count, "sum": {"visits": visits}}

class Tests(unittest.TestCase):
    def test_zero(self):
        self.assertEqual(parse(payload([])), (0, 0))
    def test_nonzero(self):
        self.assertEqual(parse(payload([group()])), (3, 7))
    def test_wrong_host(self):
        with self.assertRaises(ValueError):
            parse(payload([group("other.example")]))
    def test_errors(self):
        for value in ({"errors": [{"message": "bad"}]}, payload(None), payload([group(count=-1)]), payload([group()]*100)):
            with self.assertRaises((ValueError, KeyError)):
                parse(value)
    def test_missing_not_zero(self):
        with self.assertRaises(KeyError):
            parse({"data": {"viewer": {"accounts": [{}]}}})
    def test_retry_only_reads(self):
        with patch("urllib.request.urlopen", side_effect=urllib.error.URLError("timeout")) as call, patch("time.sleep"):
            with self.assertRaises(urllib.error.URLError):
                post("https://example.com", {}, {}, retry=True)
            self.assertEqual(call.call_count, 3)
        with patch("urllib.request.urlopen", side_effect=urllib.error.URLError("timeout")) as call:
            with self.assertRaises(urllib.error.URLError):
                post("https://example.com", {}, {})
            self.assertEqual(call.call_count, 1)
    def test_filter_and_claim_order(self):
        self.assertIn('requestHost: "by-maria-beauty-store.pages.dev"', code)
        self.assertLess(code.index("refs/tags/maria-analytics-claimed/"), code.index("https://api.brevo.com"))
        self.assertIn('if os.environ["SEND_REPORT"].lower() != "true":', code)

if __name__ == "__main__":
    unittest.main()
