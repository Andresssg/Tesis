class ParksRouter:
    """
    Enrutador para el modelo Parks.
    Asigna el modelo Parks a la base de datos 'parks'.
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'tesisapp' and model._meta.model_name == 'parks':
            return 'parks'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'tesisapp' and model._meta.model_name == 'parks':
            return 'parks'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'tesisapp' and obj2._meta.app_label == 'tesisapp':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'tesisapp' and model_name == 'parks':
            return db == 'parks'
        return None

class DefaultRouter:
    """
    Enrutador para los modelos Conteos y Reportes.
    Asigna los modelos Conteos y Reportes a la base de datos 'default'.
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'tesisapp' and model._meta.model_name in ['conteos', 'reportes']:
            return 'default'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'tesisapp' and model._meta.model_name in ['conteos', 'reportes']:
            return 'default'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'tesisapp' and obj2._meta.app_label == 'tesisapp':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'tesisapp' and model_name in ['conteos', 'reportes']:
            return db == 'default'
        return None
