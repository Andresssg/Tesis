import multiprocessing

#Comando para inciar el servidor gunicorn
command = '${GUNICORN_COMMAND}'
#Añade la aplicacion al pythonpath
pythonpath = '${GUNICORN_PYTHONPATH}'
bind = '${GUNICORN_BIND}'
workers = multiprocessing.cpu_count() * 4 + 1
timeout = '${GUNICORN_TIMEOUT}'