import os

def test_expected_files_exist():
    assert os.path.exists("src/text_extraction.py"), "src/text_extraction.py missing"
    assert os.path.exists("requirements.txt"), "requirements.txt missing"
