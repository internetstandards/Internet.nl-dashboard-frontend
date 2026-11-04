# SPDX-License-Identifier: Apache-2.0
"""Run the real Django API and Dramatiq actor against a disposable browser-test database.

Point DASHBOARD_BACKEND_PATH at an installed backend checkout. The launcher never
uses the development database. Only the broker and DNS are replaced for repeatable
local tests; sessions, CSRF, multipart parsing, validation and writes use real code.
"""

import importlib
import os
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import types

backend = Path(os.environ["DASHBOARD_BACKEND_PATH"]).resolve()
sys.path.insert(0, str(backend))

with TemporaryDirectory(prefix="internetnl-browser-") as temporary:
    os.environ["DJANGO_DATABASE"] = "test"
    os.environ["DB_NAME"] = str(Path(temporary) / "browser.sqlite3")
    os.environ["MEDIA_ROOT"] = str(Path(temporary) / "uploads")
    os.environ["LOCKFILE_DIR"] = str(Path(temporary) / "locks")
    os.environ["SECRET_KEY"] = "isolated-domain-batch-browser-tests"
    os.environ["DEBUG"] = "1"
    base = importlib.import_module("dashboard.settings")
    isolated = types.ModuleType("domain_batch_browser_settings")
    for name in dir(base):
        if name.isupper():
            setattr(isolated, name, getattr(base, name))
    isolated.DATABASES = {
        "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": os.environ["DB_NAME"], "OPTIONS": {"timeout": 30}}
    }
    isolated.CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
    isolated.CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:4173"]
    isolated.SESSION_COOKIE_SECURE = False
    isolated.CSRF_COOKIE_SECURE = False
    isolated.DRAMATIQ_BROKER = {
        "BROKER": "dramatiq.brokers.stub.StubBroker",
        "OPTIONS": {},
        "MIDDLEWARE": [
            "dramatiq.middleware.Pipelines",
            "dramatiq.middleware.Retries",
            "dramatiq.middleware.TimeLimit",
            "dramatiq.middleware.Callbacks",
            "dramatiq.middleware.AgeLimit",
            "dramatiq.middleware.GroupCallbacks",
            "django_dramatiq.middleware.DbConnectionsMiddleware",
        ],
    }
    isolated.DRAMATIQ_RESULT_BACKEND = {
        "BACKEND": "dramatiq.results.backends.StubBackend",
        "BACKEND_OPTIONS": {},
        "MIDDLEWARE_OPTIONS": {"store_results": False},
    }
    isolated.LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {"console": {"class": "logging.StreamHandler"}},
        "root": {"handlers": ["console"], "level": "WARNING"},
    }
    sys.modules[isolated.__name__] = isolated
    os.environ["DJANGO_SETTINGS_MODULE"] = isolated.__name__

    import django

    django.setup()
    from django.core.management import call_command

    call_command("migrate", verbosity=0, interactive=False)

    from constance import config

    config.DASHBOARD_MAXIMUM_DOMAINS_PER_LIST = 3
    config.DASHBOARD_MAXIMUM_DOMAINS_PER_SPREADSHEET = 20000
    config.SUBDOMAIN_SUGGESTION_ENABLED = True
    from django.contrib.auth.models import User
    from websecmap import tldextract as domains
    from tldextract import TLDExtract

    domains.extract = TLDExtract(cache_dir=None, suffix_list_urls=())
    from websecmap.organizations.models import Url
    from dashboard.internet_nl_dashboard.models import Account, DashboardUser, UrlList

    Account.objects.create(name="Fallback account for incomplete new users")
    for name in ("picker", "drop", "list", "corrections", "text", "failure", "cancel", "stalled", "overwrite"):
        account = Account.objects.create(name="Browser " + name)
        user = User.objects.create_user(username="browser-" + name, password="browser-test-password")
        DashboardUser.objects.create(user=user, account=account)
        urllist = UrlList.objects.create(account=account, name="Browser uploads", enable_scans=False)
        existing = Url.add("existing.nl")
        urllist.urls.add(existing)
        if name == "overwrite":
            urllist.urls.add(Url.add("remove.nl"))
            urllist.taggedurlinurllist_set.get(url=existing).tags.add("original")
        if name == "stalled":
            from datetime import timedelta
            from django.utils.timezone import now
            from dashboard.internet_nl_dashboard.models import DomainBatch

            DomainBatch.objects.create(
                account=account,
                user=user.dashboarduser,
                urllist=urllist,
                target_list=True,
                source="spreadsheet",
                filename="stalled.csv",
                stage="addition",
                status="running",
                worker_token="crashed-browser-worker",
                updated_on=now() - timedelta(hours=1),
            )

    from dashboard.internet_nl_dashboard.logic import domain_batches

    domain_batches.has_a_or_aaaa = lambda domain: domain != "unresolvable.nl"
    domain_batches.has_soa = lambda domain: False
    from dramatiq import Worker, get_broker

    worker = Worker(get_broker(), worker_threads=1, worker_timeout=100)
    worker.start()
    try:
        call_command("runserver", "127.0.0.1:18765", use_reloader=False, verbosity=0)
    finally:
        worker.stop()
