import multiprocessing

#Comando para inciar el servidor gunicorn
command = 'gunicorn'
#Añade la aplicacion al pythonpath
pythonpath = '/backend/tesis_project'
bind = '0.0.0.0:8000'
workers = multiprocessing.cpu_count() * 4 + 1
timeout = 1000