from django.apps import AppConfig


class MonitorConfig(AppConfig):
    name = 'monitor'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import os
        if os.environ.get('RUN_MAIN') == 'true':
            from .scheduler import start
            start()
