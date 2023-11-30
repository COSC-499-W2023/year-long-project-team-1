import os


def get_env(key: str, default: str):
    return os.environ.get(key, default=default)
